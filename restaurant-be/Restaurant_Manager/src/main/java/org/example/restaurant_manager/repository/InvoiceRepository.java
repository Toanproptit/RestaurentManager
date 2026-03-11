package org.example.restaurant_manager.repository;

import java.util.List;

import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "FUNCTION('YEAR', i.date), FUNCTION('MONTH', i.date), FUNCTION('DAY', i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY FUNCTION('YEAR', i.date), FUNCTION('MONTH', i.date), FUNCTION('DAY', i.date) " +
	    "ORDER BY FUNCTION('YEAR', i.date) DESC, FUNCTION('MONTH', i.date) DESC, FUNCTION('DAY', i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByDay();

    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "FUNCTION('YEAR', i.date), FUNCTION('MONTH', i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY FUNCTION('YEAR', i.date), FUNCTION('MONTH', i.date) " +
	    "ORDER BY FUNCTION('YEAR', i.date) DESC, FUNCTION('MONTH', i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByMonth();

    @Query("SELECT new org.example.restaurant_manager.dto.response.RevenueStatisticsResponse(" +
	    "FUNCTION('YEAR', i.date), SUM(i.total)) " +
	    "FROM Invoice i " +
	    "GROUP BY FUNCTION('YEAR', i.date) " +
	    "ORDER BY FUNCTION('YEAR', i.date) DESC")
	List<RevenueStatisticsResponse> getRevenueByYear();
}
