package com.main.omniplanner.health;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthEventsRepository extends JpaRepository<HealthEvents, Integer> {
    List<HealthEvents> findByUserId(int userId);
}
