package com.main.omniplanner.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<GenericEvent, Integer> {
    /**
     * Find upcoming events for a user
     * - Events that are repeating OR have a date greater than or equal to current time
     * - Events that are not completed (completed = 0)
     */
    @Query("SELECT f FROM GenericEvent f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= :currentTimeMillis) AND f.completed = false ORDER BY f.event_date ASC")
    List<GenericEvent> findUpcomingByUserId(@Param("userId") Integer userId, @Param("currentTimeMillis") Long currentTimeMillis);

    /**
     * Find upcoming events of a specific type for a user
     * - Events of a specific type
     * - Events that are repeating OR have a date greater than or equal to current time
     * - Events that are not completed (completed = 0)
     */
    @Query("SELECT f FROM GenericEvent f WHERE f.userId = :userId AND f.event_type = :event_type AND (f.repeating = true OR f.event_date >= :currentTimeMillis) AND f.completed = false ORDER BY f.event_date ASC")
    List<GenericEvent> findByEventType(@Param("event_type") String event_type, @Param("userId") Integer userId, @Param("currentTimeMillis") Long currentTimeMillis);

    /**
     * Delete a specific event for a user
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM GenericEvent f WHERE f.userId = :userId AND f.id = :id")
    int deleteEvent(@Param("id") int id, @Param("userId") Integer userId);

    /**
     * Mark an event as completed
     */
    @Modifying
    @Query("UPDATE GenericEvent ge SET ge.completed = true WHERE ge.id = :id")
    int completeEvent(@Param("id") int id);
}