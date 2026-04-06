import { Friends, FriendShipStatus } from "../Models/Friends";
import { FriendsRepositoryInterface } from "../Interfaces/FriendsInterfaces";
import { pool as pg_connection } from "../Config/pg_connection";
import { create } from "domain";

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
    async respondOrAcceptFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus, acceptedAt: Date): Promise<Friends | null> {
        
        const query = `UPDATE friends SET status = $1, acceptedAt = $2, WHERE (requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3) RETURNING *`;

        const values = [status, acceptedAt, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;

    }


    // ====================================== Get All Friends By List By User Id =============================================//
    async getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus, createdAt?: Date): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM friends WHERE addresseeId = $1 AND requesterId = $2 AND status = $3 AND deletedAt IS NULL';

        const values : any[] = [requesterId, addresseeId, status || FriendShipStatus.Pending];

        if(!createdAt) {
            values.push(new Date());
        } else {
            values.push(createdAt);
        }

        const result = await this.pg.query(query, values);

        return result.rows.length >0 ? result.rows : null;
    }

    async getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = $3 AND deletedAt IS NULL';
        const values = [requesterId, addresseeId, status || FriendShipStatus.Pending , new Date()];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    async getFriendshipStatusByList(requesterId: number, addresseeId: number, statusList: FriendShipStatus[]): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = ANY($3) AND deletedAt IS NULL';
        const values = [requesterId, addresseeId, statusList || [FriendShipStatus.Pending, FriendShipStatus.Accepted], new Date()];

        const result = await this.pg.query(query, values);

        return result.rows.length >0 ? result.rows : null;
    }


    // ============================== Get Friend in List By User Id ===============================================
    async getFriendshipStatus(requesterId: number, addresseeId: number): Promise<Friends | null> {
        
        const query = 'SELECT * FROM friends WHERE addresseeId = $1 AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    async getFriendsListByRequesterId(requesterId: number, status: FriendShipStatus): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, status || FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows.length >0 ? result.rows : null;
    }

    // ========================================= Update Friend Request and Status =========================================
    async updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus, updatedAt: Date): Promise<Friends | null> {
        
        const query = 'UPDATE friends SET status = $1, updatedAt = $2 WHERE ((requesterId = $3 AND addresseeId = $4) OR (requesterId = $4 AND addresseeId = $3)) RETURNING *';
        const values = [status, updatedAt = new Date(), requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    // ========================================= Search Friends By User Id and Search Term ====================================== //
    async searchFriendsByRequesterIdAndSearchTerm(requesterId: number, searchTerm: string): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM  friends f JOIN users u ON (u.id = f.requesterId OR u.id = f.addresseeId) WHERE (f.requesterId = $1 OR f.addresseeId = $1) AND status = $2 AND (u.firstName LIKE $3 OR u.lastName LIKE $3 OR u.email LIKE $3) AND deletedAt IS NULL';
        const values = [requesterId, FriendShipStatus.Accepted, `%${searchTerm}%`];

        const result = await this.pg.query(query, values);

        return result.rows.length >0 ? result.rows : null;
    }


    // ========================================== Block and Unblock Friend By ID ============================================================//
    async blockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {
        
        const query = 'UPDATE friends SET status =$1 WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) RETURNING *';
        const values = [FriendShipStatus.Blocked, requesterId, addresseeId];

        const result = await this.pg.query(query, values);
        
        return result.rows[0] || null;
    }

    async unblockFriendById(requesterId: number, addresseeId: number): Promise<Friends | null> {
        
        const query = 'UPDATE friends SET status = $1 WHERE ((requesterId = $2 AND addresseeId = $3) OR (requesterId = $3 AND addresseeId = $2)) RETURNING *';
        const values = [FriendShipStatus.Accepted, requesterId, addresseeId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ========================================== Count and Metrics of Friends ================================================================//
    async countFriendsByUserId(requesterId: number): Promise<number> {
        
        const query = 'SELECT COUNT (*) FROM friends WHERE (requesterId = $1 OR addresseeId = $1) AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, FriendShipStatus.Accepted, new Date()];

        const result = await this.pg.query(query, values);

        return result.rows[0].count;
    }


    async countPendingFriendRequestsByUserId(requesterId: number): Promise<number> {
        
        const query = 'SELECT COUNT (*) FROM friends WHERE addresseeId = $1 AND status = $2 AND deletedAt IS NULL';
        const values = [requesterId, FriendShipStatus.Pending];

        const result = await this.pg.query(query, values);

        return result.rows[0].count;
    }



    // ================================================= Get Manual Friends Between Two Users ============================================================//
    async getMutualFriendsBetweenUsers(requesterId: number, otherUserId: number): Promise<Friends[] | null> {
        
        const query = 'SELECT * FROM friends WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = $3 AND deletedAt IS NULL';
        const values = [requesterId, otherUserId, FriendShipStatus.Accepted];

        const result = await this.pg.query(query, values);

        return result.rows.length >0 ? result.rows : null;
    }


    // ================================================= Get Suggestion Friends By User ID ==================================================================//
    async getSuggestedFriendsByRequesterId(requesterId: number, otherUserId: number): Promise<Friends[] | null> {
  const query = `
    SELECT f.* 
    FROM friends f
    JOIN users u ON (
      (u.id = f.requesterId OR u.id = f.addresseeId)
    )
    WHERE f.status = $1
      AND f.deletedAt IS NULL
      AND (
        -- u is friend of userId
        EXISTS (
          SELECT 1 FROM friends f1
          WHERE (f1.requesterId = $2 OR f1.addresseeId = $2)
            AND (u.id = f1.requesterId OR u.id = f1.addresseeId)
            AND f1.status = $1
            AND f1.deletedAt IS NULL
        )
        -- u is friend of otherUserId
        AND EXISTS (
          SELECT 1 FROM friends f2
          WHERE (f2.requesterId = $3 OR f2.addresseeId = $3)
            AND (u.id = f2.requesterId OR u.id = f2.addresseeId)
            AND f2.status = $1
            AND f2.deletedAt IS NULL
        )
      )
      -- exclude the two users themselves
      AND u.id NOT IN ($2, $3)
  `;
  const values = [FriendShipStatus.Accepted, requesterId, otherUserId];

  const result = await this.pg.query(query, values);
  return result.rows.length > 0 ? result.rows : null;
}


// ======================================================== Get History of Friend and Audit loginUserAccount ================================================================//
async getFriendshipHistoryByRequesterId(requesterId: number, addresseeId: number): Promise<Friends[] | null> {
    
    const query = 'SELECT * FROM friends WHERE (requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1) ORDER BY createdAt DESC';
    const values = [requesterId, addresseeId || 0];

    const result = await this.pg.query(query, values);

    return result.rows.length >0 ? result.rows : null;
}

//  =============================================== MORE FEATURES ADD HERE ================================================================//



}