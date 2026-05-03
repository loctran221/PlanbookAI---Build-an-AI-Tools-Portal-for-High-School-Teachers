package com.planbookai.config;

import com.planbookai.entity.Subject;
import com.planbookai.entity.Topic;
import com.planbookai.repository.SubjectRepository;
import com.planbookai.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;

    @Override
    public void run(String... args) {
        if (subjectRepository.count() == 0) {
            Subject chemistry = new Subject();
            chemistry.setName("Chemistry 10");
            subjectRepository.save(chemistry);

            Subject chemistry11 = new Subject();
            chemistry11.setName("Chemistry 11");
            subjectRepository.save(chemistry11);

            List<String> topics = List.of(
                "Atomic Structure",
                "Periodic Table of Elements",
                "Chemical Bonding",
                "Redox Reactions",
                "Chemical Energy",
                "Reaction Rates"
            );

            for (String topicName : topics) {
                Topic topic = new Topic();
                topic.setSubject(chemistry);
                topic.setName(topicName);
                topicRepository.save(topic);
            }
            
            Topic t11 = new Topic();
            t11.setSubject(chemistry11);
            t11.setName("Electrolytic Dissociation");
            topicRepository.save(t11);
            
            Topic t11b = new Topic();
            t11b.setSubject(chemistry11);
            t11b.setName("Nitrogen - Phosphorus");
            topicRepository.save(t11b);
        } else {
            // Update existing ones to English
            List<Subject> subjects = subjectRepository.findAll();
            for (Subject s : subjects) {
                if (s.getName().equals("Hóa Học 10")) s.setName("Chemistry 10");
                if (s.getName().equals("Hóa Học 11")) s.setName("Chemistry 11");
                subjectRepository.save(s);
            }
            
            List<Topic> topics = topicRepository.findAll();
            for (Topic t : topics) {
                switch (t.getName()) {
                    case "Cấu tạo nguyên tử": t.setName("Atomic Structure"); break;
                    case "Bảng tuần hoàn các nguyên tố hóa học": t.setName("Periodic Table of Elements"); break;
                    case "Liên kết hóa học": t.setName("Chemical Bonding"); break;
                    case "Phản ứng oxi hóa - khử": t.setName("Redox Reactions"); break;
                    case "Năng lượng hóa học": t.setName("Chemical Energy"); break;
                    case "Tốc độ phản ứng hóa học": t.setName("Reaction Rates"); break;
                    case "Sự điện li": t.setName("Electrolytic Dissociation"); break;
                    case "Nitơ - Photpho": t.setName("Nitrogen - Phosphorus"); break;
                }
                topicRepository.save(t);
            }
        }
            System.out.println("====== SEEDED/UPDATED DEFAULT SUBJECTS AND TOPICS ======");
    }
}
