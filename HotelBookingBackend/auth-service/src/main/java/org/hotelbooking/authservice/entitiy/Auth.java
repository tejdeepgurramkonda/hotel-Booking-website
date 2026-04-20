package org.hotelbooking.authservice.entitiy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "auth_table")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Auth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email",unique = true, nullable = false)
    private String email;

    @Column(name = "user_password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,name = "user_role")
    private Role role;

    @Column(nullable = false,name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        this.createdAt= LocalDateTime.now();
    }
}
