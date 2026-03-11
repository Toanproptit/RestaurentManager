package org.example.restaurant_manager.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
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
            fetch = FetchType.LAZY
    )
    private Set<DiningTable> diningTables = new HashSet<>();

    public void addDiningTable(DiningTable diningTable) {
        this.diningTables.add(diningTable);
        diningTable.setReservationDetail(this);
    }

    public void removeDiningTable(DiningTable diningTable) {
        this.diningTables.remove(diningTable);
        diningTable.setReservationDetail(null);
    }

}
