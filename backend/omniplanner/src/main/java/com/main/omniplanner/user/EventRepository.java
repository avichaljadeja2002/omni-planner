package com.main.omniplanner.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<GenericEvent, Integer> {
    @Query("SELECT f FROM GenericEvent f WHERE f.userId = :userId AND (f.repeating = true OR f.event_date >= :currentTimeMillis) ORDER BY f.event_date ASC")
    List<GenericEvent> findUpcomingByUserId(@Param("userId") Integer userId, @Param("currentTimeMillis") Long currentTimeMillis);

    @Query("SELECT f FROM GenericEvent f WHERE f.userId = :userId AND f.event_type = :event_type AND (f.repeating = true OR f.event_date >= :currentTimeMillis) ORDER BY f.event_date ASC")
    List<GenericEvent> findByEventType(@Param("event_type") String event_type, @Param("userId") Integer userId, @Param("currentTimeMillis") Long currentTimeMillis);
}
