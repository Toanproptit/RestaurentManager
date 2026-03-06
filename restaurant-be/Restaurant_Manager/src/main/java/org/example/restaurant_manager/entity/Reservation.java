package org.example.restaurant_manager.entity;



import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;


    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)


    private Customer customer;

    @OneToMany(
            mappedBy = "reservation",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )

    private Set<ReservationDetail> reservationDetail = new HashSet<>();



    public void addDetaiReservations(ReservationDetail reservationDetail) {
        reservationDetail.setReservation(this);
        this.reservationDetail.add(reservationDetail);
    }
    public void removeDetaiReservations(ReservationDetail reservationDetail) {
        reservationDetail.setReservation(null);
        this.reservationDetail.remove(reservationDetail);
    }
}

