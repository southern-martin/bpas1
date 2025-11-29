import * as projectsService from "../services/projects.service.js";

export async function createProject(req, res) {
  try {
    const project = await projectsService.createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
}

export async function getProjects(req, res) {
  try {
    const projects = await projectsService.getProjects();
    res.json(projects);
  } catch (err) {
    console.error("Get Projects Error:", err);
    res.status(500).json({ error: "Failed to load projects" });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    project ? res.json(project) : res.status(404).json({ error: "Project not found" });
  } catch (err) {
    console.error("Get Project Error:", err);
    res.status(500).json({ error: "Failed to load project" });
  }
}

export async function getProjectCards(req, res) {
  try {
    const cards = await projectsService.getProjectCards(req.params.id);
    res.json(cards);
  } catch (err) {
    console.error("Get Project Cards Error:", err);
    res.status(500).json({ error: "Failed to load project cards" });
  }
}

export async function updateProject(req, res) {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body);
    project ? res.json(project) : res.status(404).json({ error: "Project not found" });
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await projectsService.deleteProject(req.params.id);
    project ? res.json({ success: true }) : res.status(404).json({ error: "Project not found" });
  } catch (err) {
    console.error("Delete Project Error:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
}
