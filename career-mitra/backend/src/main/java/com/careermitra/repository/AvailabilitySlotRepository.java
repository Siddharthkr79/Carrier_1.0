package com.careermitra.repository;

import com.careermitra.entity.AvailabilitySlot;
import com.careermitra.entity.Mentor;
import com.careermitra.entity.SlotDayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByMentor(Mentor mentor);
    List<AvailabilitySlot> findByMentorAndDayOfWeek(Mentor mentor, SlotDayOfWeek dayOfWeek);
}
