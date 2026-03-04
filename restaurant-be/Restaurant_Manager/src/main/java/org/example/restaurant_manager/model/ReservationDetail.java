package org.example.restaurant_manager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
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
            mappedBy = "detailReservation",
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
