package org.example.restaurant_manager.service;

import jakarta.transaction.Transactional;
import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.mapper.DiningTableMapper;
import org.example.restaurant_manager.model.DiningTable;
import org.example.restaurant_manager.repository.DiningTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiningTableService {

    private final DiningTableRepository diningTableRepository;
    private final DiningTableMapper diningTableMapper;

    public DiningTableService(DiningTableRepository diningTableRepository,
                              DiningTableMapper diningTableMapper) {
        this.diningTableRepository = diningTableRepository;
        this.diningTableMapper = diningTableMapper;
    }

    public List<DiningTableResponse> findAll() {
        return diningTableRepository.findAll()
                .stream()
                .map(diningTableMapper::toDiningTableResponse)
                .toList();
    }

    public DiningTableResponse findById(Long id) {
        return diningTableMapper.toDiningTableResponse(getEntity(id));
    }

    public DiningTableResponse create(DiningTable diningTable) {
        return diningTableMapper.toDiningTableResponse(
                diningTableRepository.save(diningTable)
        );
    }

    @Transactional
    public DiningTableResponse update(Long id, DiningTable newTable) {
        DiningTable oldTable = getEntity(id);

        oldTable.setName(newTable.getName());
        oldTable.setDescription(newTable.getDescription());
        oldTable.setMaxGuests(newTable.getMaxGuests());
        oldTable.setReservationDetail(newTable.getReservationDetail());

        return diningTableMapper.toDiningTableResponse(oldTable);
    }

    public void deleteById(Long id) {
        DiningTable table = getEntity(id);
        diningTableRepository.delete(table);
    }

    private DiningTable getEntity(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DiningTable not found"));
    }
}