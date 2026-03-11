package org.example.restaurant_manager.entity;


import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;
    private double total;

    @OneToOne
    @JoinColumn(name = "order_id",unique = true)
    private Order order;

    public void attachOrder(Order order) {
        if (this.order != null && this.order != order) {
            this.order.setInvoice(null);
        }

        this.order = order;

        if (order != null) {
            order.setInvoice(this);
        }
    }

}
