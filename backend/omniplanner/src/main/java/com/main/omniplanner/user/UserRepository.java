package com.main.omniplanner.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(int id);

    @Query("SELECT id FROM User WHERE token = :token")
    Integer getIdByToken(String token);

    @Query("SELECT NEW com.main.omniplanner.user.UserCalendarInfo(u.id, u.googleCalendarLinked, u.googleCalendarAccessToken) FROM User u WHERE u.token = :token")
    UserCalendarInfo findUserCalendarInfoByToken(@Param("token") String token);
}
