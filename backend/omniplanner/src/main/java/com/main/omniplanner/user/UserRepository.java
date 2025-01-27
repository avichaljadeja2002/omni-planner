package com.main.omniplanner.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findById(int id);

    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    List<User> findByUserName(String userName);

    User save(User user);
}
