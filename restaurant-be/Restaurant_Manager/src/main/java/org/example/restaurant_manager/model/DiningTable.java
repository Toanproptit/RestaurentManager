package org.example.restaurant_manager.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tables")

public class DiningTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private int maxGuests;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_detail_id", nullable = false)
    private  ReservationDetail reservationDetail;

}
