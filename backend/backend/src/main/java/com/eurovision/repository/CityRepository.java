package com.eurovision.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.eurovision.entity.City;

public interface CityRepository extends PagingAndSortingRepository<City, Integer> {

    Page<City> findAllByOrderByNameAsc(Pageable pageable);
    
    List<City> findAllByOrderByNameAsc();

}
