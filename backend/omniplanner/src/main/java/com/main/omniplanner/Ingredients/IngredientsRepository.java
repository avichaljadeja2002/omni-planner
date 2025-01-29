package com.main.omniplanner.Ingredients;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientsRepository extends JpaRepository<Ingredients, Integer> {

    @Query("SELECT f FROM Ingredients f WHERE f.userId = :userId")
    List<Ingredients> findIngredientsByUserId(@Param("userId") Integer userId);
}
