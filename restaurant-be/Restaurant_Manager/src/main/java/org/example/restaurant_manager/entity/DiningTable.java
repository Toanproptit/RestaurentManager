package org.example.restaurant_manager.entity;

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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id" , nullable = false)
    private Order order;

}
