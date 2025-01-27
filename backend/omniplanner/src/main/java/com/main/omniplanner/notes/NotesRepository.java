package com.main.omniplanner.notes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesRepository extends JpaRepository<Notes, Integer> {
    @Query("SELECT f FROM Notes f WHERE f.userId = :userId ORDER BY f.event_date DESC, f.event_time DESC")
    List<Notes> findByUserId(@Param("userId") int userId);
}
