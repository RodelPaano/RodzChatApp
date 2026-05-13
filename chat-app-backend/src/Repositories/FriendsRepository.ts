import { Friends, FriendShipStatus, OnlineFriends } from "../Models/Friends";
import { FriendsRepositoryInterface } from "../Interfaces/FriendsInterfaces";
import { pool as pg_connection } from "../Config/pg_connection";

export default class FriendsRepository implements FriendsRepositoryInterface {
    private pg = pg_connection;

    // ============================================ Add New Friend ====================================//
    async addFriend(requesterId: number, addresseeId: number, createdAt: Date): Promise<Friends | null> {

        const query = `INSERT INTO friends (requesterId, addresseeId, status, createdAt) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [requesterId, addresseeId, FriendShipStatus.Pending, createdAt];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // =========================================== Hard Remove Friend Request By Requester ID and Addressee ID =========================================//
    async HardDeleteFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus = FriendShipStatus.Pending): Promise<Friends | null> {

        const query = `DELETE FROM friends WHERE requesterId = $1 AND addresseeId = $2 AND status = $3 RETURNING *`;
        const values = [requesterId, addresseeId, status];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // =========================================== Soft Delete Friend Request By Requester ID and Addressee ID =========================================//
    async softDeleteFriendRequest(requesterId: number, addresseeId: number, deletedAt: Date): Promise<Friends | null> {

        const query = `UPDATE friends SET deletedAt = $1, updatedAt = $2 
                        WHERE ((requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3)) 
                        AND status = $5 AND deletedAt IS NULL RETURNING *`;
        const values = [deletedAt, new Date(), requesterId, addresseeId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================= Response and Refuse Friend Request and Process in the Database =========================== //
    // FIX BUG 1: Removed the stray comma before WHERE
    async respondOrAcceptFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus, acceptedAt: Date): Promise<Friends | null> {

        const query = `UPDATE friends SET status = $1, acceptedAt = $2, updatedAt = NOW() 
                    WHERE ((requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3)) 
                    AND status = $5 RETURNING *`;
        const values = [status, acceptedAt, requesterId, addresseeId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ====================================== Get All Friends By List By User Id =============================================//
    // FIX BUG 2: Fixed swapped addresseeId/requesterId in WHERE clause, removed unused createdAt push
    async getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus = FriendShipStatus.Pending): Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE requesterId = $1 AND addresseeId = $2 AND status = $3 AND deletedAt IS NULL`;
        const values = [requesterId, addresseeId, status];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // FIX BUG 3: Removed unused new Date() from values, fixed return from rows[0] to rows
    async getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) 
                        OR (requesterId = $2 AND addresseeId = $1)) AND status = $3 AND deletedAt IS NULL`;
        const values = [requesterId, addresseeId, status || FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    async getFriendshipStatusByList(requesterId: number, addresseeId: number, statusList: FriendShipStatus[]): Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) 
                    OR (requesterId = $2 AND addresseeId = $1)) AND status = ANY($3) AND deletedAt IS NULL`;
        const values = [requesterId, addresseeId, statusList ];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ============================== Get Friend in List By User Id =================================================//

    async getFriendsListByRequesterId(requesterId: number, status: FriendShipStatus = FriendShipStatus.Accepted): Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2 AND deletedAt IS NULL`;
        const values = [ requesterId, status ];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ========================================= Update Friend Request and Status =========================================
    // FIX WARN 2: Cleaned up confusing assignment inside values array
    async updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus, updatedAt: Date): Promise<Friends | null> {

        const query = 'UPDATE friends SET status = $1, updatedAt = $2 WHERE ((requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3)) RETURNING *';
        const values = [status, updatedAt, requesterId, addresseeId ];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================================= Search Friends By User Id and Search Term ====================================== //
    async searchFriendsByRequesterIdAndSearchTerm(requesterId: number, searchTerm: string): Promise<Friends[] | null> {

       const query = `SELECT DISTINCT f.* FROM friends f
        JOIN users u ON ((u.id = requesterId AND f.addresseeId = $1) OR (u.id = addresseeId AND f.requesterId = $1) )
        WHERE f.status = $2 AND f.deletedAt IS NULL AND (u.firstName ILIKE $3 OR u.lastName ILIKE $3 OR u.email ILIKE $3)`;

        const values = [requesterId, FriendShipStatus.Accepted, `%${searchTerm}%`];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }

    // ========================================== Block and Unblock Friend By ID ============================================================//
    async blockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = `UPDATE friends SET status = $1, blockedAt = NOW(), updatedAt = NOW() 
                        WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) 
                        AND status IN ('Accepted', 'Pending")  RETURNING *`;
        const values = [FriendShipStatus.Blocked, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    async unblockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {

        const query = `UPDATE friends SET status = $1, blockedAt = NULL, updatedAt = NOW() 
                    WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) 
                    AND status = $4 RETURNING *`;
        const values = [FriendShipStatus.Accepted, requesterId, addresseeId, FriendShipStatus.Blocked];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================================== Count and Metrics of Friends ================================================================//
    // FIX BUG 5: Removed unused new Date() from values, added parseInt() for COUNT result
    async countFriendsByUserId(requesterId: number): Promise<number> {

        const query = `SELECT COUNT(*) FROM friends WHERE (requesterId = $1 OR addresseeId = $1) 
                AND status = $2 AND deletedAt IS NULL`;
        const values = [requesterId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return parseInt(result.rows[0].count, 10);
    }

    async countPendingFriendRequestsByUserId(requesterId: number): Promise<number> {

        const query = `SELECT COUNT(*) FROM friends WHERE addresseeId = $1 AND status = $2 AND deletedAt IS NULL`;
        const values = [requesterId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return parseInt(result.rows[0].count, 10);
    }

    // ================================================= Get Mutual Friends Between Two Users ============================================================//
    async getMutualFriendsBetweenUsers(requesterId: number, otherUserId: number): Promise<Friends[] | null> {

        const query = `
            SELECT DISTINCT
                CASE
                    WHEN f1.requesterId = $1 THEN f1.addresseeId
                    ELSE f1.requesterId
                END AS mutualFriend
            FROM friends f1
            JOIN friends f2 ON (
                (f2.requesterId = $2 OR f2.addresseeId = $2)
            )
            WHERE f1.status    = $3
              AND f2.status    = $3
              AND f1.deletedAt IS NULL
              AND f2.deletedAt IS NULL
              AND (f1.requesterId = $1 OR f1.addresseeId = $1)
              AND (
                    CASE WHEN f1.requesterId = $1 THEN f1.addresseeId ELSE f1.requesterId END
                  ) IN (
                    SELECT CASE WHEN f2.requesterId = $2 THEN f2.addresseeId ELSE f2.requesterId END
                    FROM friends f2
                    WHERE (f2.requesterId = $2 OR f2.addresseeId = $2)
                      AND f2.status    = $3
                      AND f2.deletedAt IS NULL
                  )
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
            r.blockedAt,
            r.createdAt,
            r.updatedAt,
            r.deletedAt
        )) : null;
    }

    // ======================================================== Get History of Friend and Audit ================================================================//
    async getFriendshipHistoryByRequesterId(requesterId: number, addresseeId: number): Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE (requesterId = $1 AND addresseeId = $2) 
                        OR (requesterId = $2 AND addresseeId = $1) ORDER BY createdAt DESC`;
        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows.map(r => new Friends(
            r.id,
            r.requesterId,
            r.addresseeId,
            r.status,
            r.acceptedAt,
            r.blockedAt,
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
    async findBlockRelationship(requesterId: number, addresseeId: number | number[]) : Promise< Friends | number[] | null> {
        let query: string;
        let values: any[];

        if (Array.isArray(addresseeId)) {
                query = `
                SELECT 
                    CASE 
                        WHEN requesterId = $1 THEN addresseeId
                        ELSE requesterId
                    END AS blockeduserid
                FROM friends
                WHERE ((requesterId = $1 AND addresseeId = ANY($2::int[]))
                    OR (requesterId = ANY($2::int[]) AND addresseeId = $1))
                AND status = 'Blocked'
            `;
            values = [requesterId, addresseeId];

            const result = await this.pg.query(query, values);
            return result.rows.map((row) => row.blockeduserid);
        } else {
                query = `
                SELECT * FROM friends
                WHERE ((requesterId = $1 AND addresseeId = $2)
                    OR (requesterId = $2 AND addresseeId = $1))
                AND status = 'Blocked'
                LIMIT 1
            `;
            values = [requesterId, addresseeId];
        }

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async findFriendshipStatus(requesterId: number, addresseeId: number) : Promise<Friends | null> {
        const query = `
            SELECT * FROM friends
            WHERE ((requesterId = $1 AND addresseeId = $2)
                OR (requesterId = $2 AND addresseeId = $1))
            LIMIT 1
        `;

        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    }


    async findFriendRelationship(requesterId: number, addresseeId: number ) : Promise<Friends | null> {
        return this.findFriendshipStatus(requesterId, addresseeId);
    }


    // ============================================= Get Blocked Friends List ===============================================================//
    async getBlockedFriendsList(requesterId: number, status: FriendShipStatus = FriendShipStatus.Blocked) : Promise<Friends[] | null> {
        
        const query = `SELECT * FROM friends WHERE (requesterId = $1 OR addresseeId = $1) 
                        AND status = $2 AND deletedAt IS NULL ORDER BY updatedAt DESC`;

        const values = [requesterId, status];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }


    // ====================================== Get Pending Friend Requests Received ===================================================== //
    async getPendingFriendRequestsReceived(addresseeId: number, status: FriendShipStatus = FriendShipStatus.Pending) : Promise<Friends[] | null> {

        const query = `SELECT * FROM friends WHERE addresseeId = $1 
                        AND status = $2 AND deletedAt IS NULL ORDER BY createdAt DESC`;

        const values = [addresseeId, status];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }


    // ========================================== Get Pending Friend Requests Sent By Requester ============================================== //
    async getPendingFriendRequestsSent(requesterId: number, status: FriendShipStatus = FriendShipStatus.Pending) : Promise<Friends[] | null> {
        
        const query = `SELECT * FROM friends WHERE requesterId = $1 AND status = $2 
                        AND deletedAt IS NULL ORDER BY createdAt DESC`;

        const values = [requesterId, status];

        const result = await this.pg.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    }


    // ======================================================= Get Friend With Pagination Where Status is Accepted =============================================== //
    async getFriendsListWithPagination(requesterId: number, offset: number, limit: number, status: FriendShipStatus = FriendShipStatus.Accepted) : Promise<{friends: Friends[]; total: number }| null> {

        const friendsQuery = `SELECT * FROM friends WHERE (requesterId = $1 OR addresseeId = $1) 
                                AND status = $2 AND deletedAt IS NULL ORDER BY createdAt DESC LIMIT $3 OFFSET $4`

        const countQuery = `SELECT COUNT(*) FROM friends WHERE (requesterId = $1 OR addresseeId = $1) 
                            AND status = $2 AND deletedAt IS NULL`;

        const  [ friendsResult, countResult ] = await Promise.all([
            this.pg.query(friendsQuery, [requesterId, status, limit, offset]),
            this.pg.query(countQuery, [requesterId, status]),
        ]);

        if(friendsResult.rows.length === 0) {
            return null;
        }

        return {
            friends : friendsResult.rows,
            total   : parseInt(countResult.rows[0].count, 10),
        };
    }


    // ================================== Count Block User or Friends By Id ====================================================== //
    async countBlockedUserByRequesterId(requesterId: number, status: FriendShipStatus = FriendShipStatus.Blocked) : Promise<number> {

        const query = `SELECT COUNT(*) FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2`;

        const values = [requesterId, status];

        const result = await this.pg.query(query, values);

        return parseInt(result.rows[0].count, 10);

    }


    // ============================================================== Count Mutual Friends Between Two Users ===============================================================//
    async countMutualFriends(requesterId: number, otherUserId: number, status: FriendShipStatus = FriendShipStatus.Accepted) : Promise<number> {

        const query = `SELECT COUNT(DISTINCT
                CASE
                    WHEN f1.requesterId = $1 THEN f1.addresseeId
                    ELSE f1.requesterId
                END
            ) AS mutualcount
            FROM friends f1
            WHERE f1.status    = $3
              AND f1.deletedAt IS NULL
              AND (f1.requesterId = $1 OR f1.addresseeId = $1)
              AND (
                    CASE
                        WHEN f1.requesterId = $1 THEN f1.addresseeId
                        ELSE f1.requesterId
                    END
                  ) IN (
                    SELECT
                        CASE
                            WHEN f2.requesterId = $2 THEN f2.addresseeId
                            ELSE f2.requesterId
                        END
                    FROM friends f2
                    WHERE (f2.requesterId = $2 OR f2.addresseeId = $2)
                      AND f2.status    = $3
                      AND f2.deletedAt IS NULL
                  )`;

        const values = [requesterId, otherUserId, status ];

        const result = await this.pg.query(query, values);
        return parseInt(result.rows[0].mutualcount, 10);
    }


    // ================================================ Check If Friends ================================================= //
    async checkIfFriends(requesterId: number, addresseeId: number, status: FriendShipStatus = FriendShipStatus.Accepted) : Promise<boolean> {

        const query = `SELECT 1 FROM friends
            WHERE ((requesterId = $1 AND addresseeId = $2)
                OR (requesterId = $2 AND addresseeId = $1))
              AND status    = $3
              AND deletedAt IS NULL
            LIMIT 1`;

        const values = [ requesterId, addresseeId, status ]; 

        const result = await this.pg.query(query, values);
        return result.rows.length > 0;
    }


    // =============================================== Get Only Online Friends ========================================================== //
    async getOnlineFriends(userId: number) : Promise<OnlineFriends[] | null> {
        const query = `
            SELECT f.*
                   u.firstName,
                   u.lastName,
                   u.isOnline
            FROM friends f
            JOIN users u ON u.id = CASE
                   WHEN f.requesterId = $1 THEN f.addressee_friends
                   ELSE f.requesterId
                END
            WHERE (f.requesterId = $1 OR f.addresseeId = $1)
            AND f.status = $2
            AND u.isOnline = true
            AND f.deletedAt IS NULL
            ORDER BY u.firstName ASC     
        `;
        const values = [userId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);
        return result.rows.length > 0 ? result.rows : null; 
    }


    //  =============================================== MORE FEATURES ADD HERE ================================================================//

}