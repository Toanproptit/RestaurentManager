package org.example.restaurant_manager.entity;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.example.restaurant_manager.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(
            mappedBy = "order",
            fetch = FetchType.LAZY,
            cascade =CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderDetail> orderDetails = new ArrayList<>();


        @OneToOne(
            mappedBy = "order",
            fetch = FetchType.LAZY
        )
        private DiningTable diningTable;

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

    public void assignDiningTable(DiningTable diningTable) {
        if (this.diningTable != null && this.diningTable != diningTable) {
            this.diningTable.setOrder(null);
        }

        this.diningTable = diningTable;

        if (diningTable != null && diningTable.getOrder() != this) {
            diningTable.setOrder(this);
        }
    }

    public void clearDiningTable() {
        if (this.diningTable == null) {
            return;
        }

        DiningTable oldTable = this.diningTable;
        this.diningTable = null;

        if (oldTable.getOrder() == this) {
            oldTable.setOrder(null);
        }
    }

}
