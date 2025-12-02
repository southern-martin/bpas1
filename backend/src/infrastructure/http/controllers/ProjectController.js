export class ProjectController {
  constructor({ createProject, getProjects, getProjectById, getProjectCards, updateProject, deleteProject }) {
    this.createProjectUseCase = createProject;
    this.getProjectsUseCase = getProjects;
    this.getProjectByIdUseCase = getProjectById;
    this.getProjectCardsUseCase = getProjectCards;
    this.updateProjectUseCase = updateProject;
    this.deleteProjectUseCase = deleteProject;
  }

  createProject = async (req, res) => {
    try {
      const project = await this.createProjectUseCase.execute(req.body);
      res.status(201).json(project);
    } catch (err) {
      console.error("Create Project Error:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  };

  getProjects = async (_req, res) => {
    try {
      const projects = await this.getProjectsUseCase.execute();
      res.json(projects);
    } catch (err) {
      console.error("Get Projects Error:", err);
      res.status(500).json({ error: "Failed to load projects" });
    }
  };

  getProjectById = async (req, res) => {
    try {
      const project = await this.getProjectByIdUseCase.execute(req.params.id);
      project ? res.json(project) : res.status(404).json({ error: "Project not found" });
    } catch (err) {
      console.error("Get Project Error:", err);
      res.status(500).json({ error: "Failed to load project" });
    }
  };

  getProjectCards = async (req, res) => {
    try {
      const cards = await this.getProjectCardsUseCase.execute(req.params.id);
      res.json(cards);
    } catch (err) {
      console.error("Get Project Cards Error:", err);
      res.status(500).json({ error: "Failed to load project cards" });
    }
  };

  updateProject = async (req, res) => {
    try {
      const project = await this.updateProjectUseCase.execute(req.params.id, req.body);
      project ? res.json(project) : res.status(404).json({ error: "Project not found" });
    } catch (err) {
      console.error("Update Project Error:", err);
      res.status(500).json({ error: "Failed to update project" });
    }
  };

  deleteProject = async (req, res) => {
    try {
      const project = await this.deleteProjectUseCase.execute(req.params.id);
      project ? res.json({ success: true }) : res.status(404).json({ error: "Project not found" });
    } catch (err) {
      console.error("Delete Project Error:", err);
      res.status(500).json({ error: "Failed to delete project" });
    }
  };
}
