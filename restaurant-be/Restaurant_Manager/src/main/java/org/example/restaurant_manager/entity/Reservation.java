package org.example.restaurant_manager.entity;



import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

import org.example.restaurant_manager.enums.ReservationStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;


    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "customer_id")


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

