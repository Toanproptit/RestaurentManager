package org.example.restaurant_manager.repository;

import java.util.List;

import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface




InvoiceRepository extends JpaRepository<Invoice,Long> {
    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i")
    Double getTotalRevenue();

    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "YEAR(i.date), MONTH(i.date), DAY(i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY YEAR(i.date), MONTH(i.date), DAY(i.date) " +
	    "ORDER BY YEAR(i.date) DESC, MONTH(i.date) DESC, DAY(i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByDay();

    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "YEAR(i.date), MONTH(i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY YEAR(i.date), MONTH(i.date) " +
	    "ORDER BY YEAR(i.date) DESC, MONTH(i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByMonth();

    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "YEAR(i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY YEAR(i.date) " +
	    "ORDER BY YEAR(i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByYear();
}
