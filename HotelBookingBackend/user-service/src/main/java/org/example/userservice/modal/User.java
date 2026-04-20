package org.example.userservice.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    private Long id;  // ID is assigned from the JWT token (matches auth_db user_id)

    private String name;
    private String email;
    private String location;
}