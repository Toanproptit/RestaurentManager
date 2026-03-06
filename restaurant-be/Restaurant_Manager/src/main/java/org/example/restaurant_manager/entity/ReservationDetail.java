package org.example.restaurant_manager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reservation_details")
public class ReservationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;



    @OneToMany(
            mappedBy = "reservationDetail",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<DiningTable> diningTables = new HashSet<>();

    public void addDiningTable(DiningTable diningTable) {
        diningTables.add(diningTable);
        diningTable.setReservationDetail(this);
    }

    public void removeDiningTable(DiningTable diningTable) {
        diningTables.remove(diningTable);
        diningTable.setReservationDetail(null);
    }
}
