package com.main.omniplanner.meals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealEventsRepository extends JpaRepository<MealEvents, Integer> {
    List<MealEvents> findByUserId(int userId);
}
