package com.taskmanagement.api.service;

import com.taskmanagement.api.model.Task;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public TaskService() {
        addTask("Learn GitHub Actions", "Create a CI/CD pipeline");
        addTask("Set up Terraform", "Provision Azure infrastructure");
        addTask("Build Task Management App", "React UI + Spring Boot API");
    }

    public List<Task> getAllTasks() {
        return tasks.values().stream()
                .sorted((a, b) -> a.getId().compareTo(b.getId()))
                .collect(Collectors.toList());
    }

    public Task addTask(String title, String description) {
        Long id = idCounter.incrementAndGet();
        Task task = new Task(id, title, description, false);
        tasks.put(id, task);
        return task;
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existing = tasks.get(id);
        if (existing == null) {
            return null;
        }
        if (updatedTask.getTitle() != null) {
            existing.setTitle(updatedTask.getTitle());
        }
        if (updatedTask.getDescription() != null) {
            existing.setDescription(updatedTask.getDescription());
        }
        existing.setCompleted(updatedTask.isCompleted());
        return existing;
    }

    public boolean deleteTask(Long id) {
        return tasks.remove(id) != null;
    }
}
