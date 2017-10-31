package com.sihuatech.task.service;

import com.onewaveinc.core.common.task.entity.TaskUICronString;


public class TaskFormBean {
	private String description;
	private String task_defid;
	private TaskUICronString taskUIC;
	public TaskUICronString getTaskUIC() {
		return taskUIC;
	}
	public void setTaskUIC(TaskUICronString taskUIC) {
		this.taskUIC = taskUIC;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTask_defid() {
		return task_defid;
	}
	public void setTask_defid(String task_defid) {
		this.task_defid = task_defid;
	}
	
}
