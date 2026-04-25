import { Friends, FriendShipStatus } from "../Models/Friends";
import { FriendsRepositoryInterface } from "../Interfaces/FriendsInterfaces";
import { pool as pg_connection } from "../Config/pg_connection";

export default class FriendsRepository implements FriendsRepositoryInterface {
    private pg = pg_connection;

    // ============================================ Add New Friend ====================================//
    async addFriend(requesterId: number, addresseeId: number, createdAt: Date): Promise<Friends | null> {

        const query = 'INSERT INTO friends (requesterId, addresseeId, status, createdAt) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [requesterId, addresseeId, FriendShipStatus.Pending, createdAt];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // =========================================== Hard Remove Friend Request By Requester ID and Addressee ID =========================================//
    async HardDeleteFriendRequest(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = 'DELETE FROM friends WHERE requesterId = $1 AND addresseeId = $2 AND status = $3 RETURNING *';
        const values = [requesterId, addresseeId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // =========================================== Soft Delete Friend Request By Requester ID and Addressee ID =========================================//
    async softDeleteFriendRequest(requesterId: number, addresseeId: number, deletedAt: Date): Promise<Friends | null> {

        const query = `UPDATE friends SET deletedAt = $1 WHERE requesterId = $2 AND addresseeId = $3 AND status = $4 RETURNING *`;
        const values = [deletedAt, requesterId, addresseeId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================= Response and Refuse Friend Request and Process in the Database =========================== //
    // FIX BUG 1: Removed the stray comma before WHERE
    async respondOrAcceptFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus, acceptedAt: Date): Promise<Friends | null> {

        const query = `UPDATE friends SET status = $1, acceptedAt = $2 WHERE (requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3) RETURNING *`;
        const values = [status, acceptedAt, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ====================================== Get All Friends By List By User Id =============================================//
    // FIX BUG 2: Fixed swapped addresseeId/requesterId in WHERE clause, removed unused createdAt push
    async getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<Friends[] | null> {

        const query = 'SELECT * FROM friends WHERE requesterId = $1 AND addresseeId = $2 AND status = $3 AND deletedAt IS NULL';
        const values: any[] = [requesterId, addresseeId, status || FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // FIX BUG 3: Removed unused new Date() from values, fixed return from rows[0] to rows
    async getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<Friends[] | null> {

        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = $3 AND deletedAt IS NULL';
        const values = [requesterId, addresseeId, status || FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    async getFriendshipStatusByList(requesterId: number, addresseeId: number, statusList: FriendShipStatus[]): Promise<Friends[] | null> {

        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = ANY($3) AND deletedAt IS NULL';
        const values = [requesterId, addresseeId, statusList || [FriendShipStatus.Pending, FriendShipStatus.Accepted]];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ============================== Get Friend in List By User Id ===============================================
    // FIX WARN 1: Fixed column name mismatch — query now correctly matches passed values
    async getFriendshipStatus(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND deletedAt IS NULL LIMIT 1';
        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    async getFriendsListByRequesterId(requesterId: number, status: FriendShipStatus): Promise<Friends[] | null> {

        const query = 'SELECT * FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, status || FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ========================================= Update Friend Request and Status =========================================
    // FIX WARN 2: Cleaned up confusing assignment inside values array
    async updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus, updatedAt: Date): Promise<Friends | null> {

        const query = 'UPDATE friends SET status = $1, updatedAt = $2 WHERE ((requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3)) RETURNING *';
        const values = [status, new Date(), requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================================= Search Friends By User Id and Search Term ====================================== //
    async searchFriendsByRequesterIdAndSearchTerm(requesterId: number, searchTerm: string): Promise<Friends[] | null> {

       const query = `SELECT DISTINCT f.* FROM friends f
        JOIN users u ON (u.id = requesterId AND f.addresseeId = $1) OR (u.id = addresseeId AND f.requesterId = $1))
        WHERE f.status = $2 AND f.deletedAt IS NULL AND (u.firstName ILIKE $3 OR u.lastName ILIKE $3 OR u.email ILIKE $3)`;

        const values = [requesterId, FriendShipStatus.Accepted, `%${searchTerm}%`];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ========================================== Block and Unblock Friend By ID ============================================================//
    async blockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = 'UPDATE friends SET status = $1, updatedAt = CURRENT_TIMESTAMP WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) RETURNING *';
        const values = [FriendShipStatus.Blocked, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] ? new Friends(
            result.rows[0].id,
            result.rows[0].requesterId,
            result.rows[0].addresseeId,
            result.rows[0].status,
            result.rows[0].acceptedAt,
            result.rows[0].createdAt,
            result.rows[0].updatedAt,
            result.rows[0].deletedAt
        ): null;
    }

    async unblockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = 'UPDATE friends SET status = $1, updatedAt = CURRENT_TIMESTAMP WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) RETURNING *';
        const values = [FriendShipStatus.Accepted, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] ? new Friends(
            result.rows[0].id,
            result.rows[0].requesterId,
            result.rows[0].addresseeId,
            result.rows[0].status,
            result.rows[0].acceptedAt,
            result.rows[0].createdAt,
            result.rows[0].updatedAt,
            result.rows[0].deletedAt
        ): null;
    }

    // ========================================== Count and Metrics of Friends ================================================================//
    // FIX BUG 5: Removed unused new Date() from values, added parseInt() for COUNT result
    async countFriendsByUserId(requesterId: number): Promise<number> {

        const query = 'SELECT COUNT(*) FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return parseInt(result.rows[0].count, 10);
    }

    async countPendingFriendRequestsByUserId(requesterId: number): Promise<number> {

        const query = 'SELECT COUNT(*) FROM friends WHERE addresseeId = $1 AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return parseInt(result.rows[0].count, 10);
    }

    // ================================================= Get Mutual Friends Between Two Users ============================================================//
    async getMutualFriendsBetweenUsers(requesterId: number, otherUserId: number): Promise<Friends[] | null> {

        const query = `
            SELECT DISTINCT CASE WHEN f1.requesterId = $1 THEN f1.addresseeId ELSE f1.requesterId END AS mutualFriend
            FROM friends f1
            JOIN friends f2 ON (
                (f1.requesterId = f2.requesterId AND f1.addresseeId = f2.addresseeId)
                OR (f1.requesterId = f2.addresseeId AND f1.addresseeId = f2.requesterId)
            )
            WHERE f1.status = $3
                AND f2.status = $3
                AND f1.deletedAt IS NULL
                AND f2.deletedAt IS NULL
                AND (f1.requesterId = $1 OR f1.addresseeId = $1)
                AND (f2.requesterId = $2 OR f2.addresseeId = $2)
        `;
        const values = [requesterId, otherUserId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ================================================= Get Suggested Friends By User ID ==================================================================//
    // FIX BUG 4: Fixed values order to match $1=requesterId, $2=addresseeId, $3=status in the CTE
    async getSuggestedFriendsByRequesterId(requesterId: number, addresseeId: number): Promise<Friends[] | null> {

        const query = `
            WITH requester_friends AS (
                SELECT f.* FROM friends f
                WHERE (f.requesterId = $1 OR f.addresseeId = $1)
                AND f.status = $3 AND f.deletedAt IS NULL
            ),
            addressee_friends AS (
                SELECT f.* FROM friends f
                WHERE (f.requesterId = $2 OR f.addresseeId = $2)
                AND f.status = $3 AND f.deletedAt IS NULL
            )
            SELECT DISTINCT * FROM (
                SELECT * FROM requester_friends
                UNION
                SELECT * FROM addressee_friends
            ) all_friends
            WHERE (all_friends.requesterId NOT IN ($1, $2)
                AND all_friends.addresseeId NOT IN ($1, $2))
        `;
        const values = [requesterId, addresseeId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows.map(r => new Friends(
            r.id,
            r.requesterId,
            r.addresseeId,
            r.status,
            r.acceptedAt,
            r.createdAt,
            r.updatedAt,
            r.deletedAt)
        ) : null;
    }

    // ======================================================== Get History of Friend and Audit ================================================================//
    async getFriendshipHistoryByRequesterId(requesterId: number, addresseeId: number): Promise<Friends[] | null> {

        const query = 'SELECT * FROM friends WHERE (requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1) ORDER BY createdAt DESC';
        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows.map(r => new Friends(
            r.id,
            r.requesterId,
            r.addresseeId,
            r.status,
            r.acceptedAt,
            r.createdAt,
            r.updatedAt,
            r.deletedAt
        )): null;
    }

    async getFriendByRequesterId(requesterId: number) : Promise<Friends[] | null> {
        const query = 'SELECT * FROM friends WHERE requesterId = $1';
        const values = [requesterId];

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows : null;
    }


    async getFriendByAddresseeId(addresseeId: number) : Promise<Friends[] | null> {
        const query = 'SELECT * FROM friends WHERE addresseeId = $1';
        const values = [addresseeId];

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows : null;
    }

    // =============================== Find Block RelationShip Repository =============================  //
    async findBlockRelationship(requesterId: number, addresseeId: number) : Promise< | null> {
        const query = `SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = 'Blocked' LIMIT 1`;

        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    //  =============================================== MORE FEATURES ADD HERE ================================================================//

}