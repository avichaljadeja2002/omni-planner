package com.main.omniplanner.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findById(int id);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    List<User> findByEmail(String email);

    User save(User user);
}
