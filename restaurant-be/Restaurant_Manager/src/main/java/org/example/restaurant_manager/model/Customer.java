package org.example.restaurant_manager.model;




import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;

    @OneToMany (
            mappedBy = "customer",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )


    private Set<Reservation> reservations = new HashSet<>();


    public void addReservation(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setCustomer(this);
    }
    public void removeReservation(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setCustomer(null);
    }

}
