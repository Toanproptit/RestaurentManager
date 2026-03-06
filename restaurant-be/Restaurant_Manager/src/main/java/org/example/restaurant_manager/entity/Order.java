package org.example.restaurant_manager.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.restaurant_manager.enums.OrderStatus;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Long totalAmount;

    private Date OrderDate;

    @OneToMany(
            mappedBy = "order",
            fetch = FetchType.LAZY,
            cascade =CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderDetail> orderDetails = new ArrayList<>();


    @OneToMany(
            mappedBy = "order",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<DiningTable>  diningTables = new HashSet<>();

    @OneToOne(
            mappedBy = "order",
            cascade = CascadeType.ALL
    )
    private Invoice invoice;


    public void addOrderDetail(OrderDetail orderDetail) {
        this.orderDetails.add(orderDetail);
        orderDetail.setOrder(this);
    }
    public void removeOrderDetail(OrderDetail orderDetail) {
        this.orderDetails.remove(orderDetail);
        orderDetail.setOrder(null);
    }

    public void addDiningTable(DiningTable diningTable) {
        this.diningTables.add(diningTable);
        diningTable.setOrder(this);
    }

    public void removeDiningTable(DiningTable diningTable) {
        this.diningTables.remove(diningTable);
        diningTable.setOrder(null);
    }

}
