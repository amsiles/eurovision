package com.eurovision.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eurovision.entity.City;
import com.eurovision.repository.CityRepository;

@RestController
@RequestMapping (value="eurovision")
public class CityController {
	
	@Autowired
	private CityRepository cityRepository;

	@GetMapping(value="cities")
	public ResponseEntity<Map<String, Object>> getCities(
			@RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "5") int size) {
		try {
		       new ArrayList<City>();
		      Pageable paging = PageRequest.of(page, size);
		      Page<City> pageCities = cityRepository.findAllByOrderByNameAsc(paging);

		      List<City> cities = pageCities.getContent();

		      Map<String, Object> response = new HashMap<>();
		      response.put("content", cities);
		      response.put("totalPages", pageCities.getTotalPages());
		      response.put("totalElements", pageCities.getTotalElements());
		      response.put("last", pageCities.isLast());
		      response.put("size", pageCities.getSize());
		      response.put("number", pageCities.getNumber());
		      
		      algoritmo(cityRepository.findAllByOrderByNameAsc());
		      
		      return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	private void algoritmo(List<City> cities) {
		List<Long> result = new ArrayList<Long>();
		cities = cities.subList(0, 30);
		for(City city: cities) {
			System.out.println(city.getId());
		}
		
		int j = (cities.get(0).getId().intValue() < cities.get(1).getId().intValue()) ?  0 : 1;
		result.add(cities.get(j).getId());
		
		while(nextCity(cities, j) != j) {
			j = nextCity(cities, j);
			result.add(cities.get(j).getId());
		}

		System.out.println("El tam es " + result.size());
		for(Long numero: result) {
			System.out.println(numero);
		}
	}
	
	private int nextCity(List<City> cities, int j) {
		Long currentValue = cities.get(j).getId();
		int posicion = j;
		Long tempValue = cities.get(j+1).getId();
		for(int z=j+1; z<30; z++) {
			if((cities.get(z).getId().intValue() <= tempValue.intValue()) &&
			(cities.get(z).getId().intValue() > currentValue.intValue())) {
				posicion = z;
				tempValue = cities.get(z).getId();
			} 
		}
		return posicion;
	}

}
