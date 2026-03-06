package org.example.restaurant_manager.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

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
        this.order = order;
        if(order!=null && order.getInvoice()!=null) {
            order.setInvoice(this);
        }
    }

}
