import { prisma } from "../db/prisma.js";
import { PrismaClientRepository } from "../infrastructure/repositories/PrismaClientRepository.js";
import { PrismaCardRepository } from "../infrastructure/repositories/PrismaCardRepository.js";
import { CreateClient } from "../application/usecases/clients/CreateClient.js";
import { GetClients } from "../application/usecases/clients/GetClients.js";
import { GetClientById } from "../application/usecases/clients/GetClientById.js";
import { GetClientCards } from "../application/usecases/clients/GetClientCards.js";
import { UpdateClient } from "../application/usecases/clients/UpdateClient.js";
import { DeleteClient } from "../application/usecases/clients/DeleteClient.js";
import { ClientController } from "../infrastructure/http/controllers/ClientController.js";
import { CreateCard } from "../application/usecases/cards/CreateCard.js";
import { GetCards } from "../application/usecases/cards/GetCards.js";
import { GetCardById } from "../application/usecases/cards/GetCardById.js";
import { UpdateCard } from "../application/usecases/cards/UpdateCard.js";
import { UpdateCardActivity } from "../application/usecases/cards/UpdateCardActivity.js";
import { CardController } from "../infrastructure/http/controllers/CardController.js";
import { PrismaProjectRepository } from "../infrastructure/repositories/PrismaProjectRepository.js";
import { CreateProject } from "../application/usecases/projects/CreateProject.js";
import { GetProjects } from "../application/usecases/projects/GetProjects.js";
import { GetProjectById } from "../application/usecases/projects/GetProjectById.js";
import { GetProjectCards } from "../application/usecases/projects/GetProjectCards.js";
import { UpdateProject } from "../application/usecases/projects/UpdateProject.js";
import { DeleteProject } from "../application/usecases/projects/DeleteProject.js";
import { ProjectController } from "../infrastructure/http/controllers/ProjectController.js";
import { GetPipeline } from "../application/usecases/pipeline/GetPipeline.js";
import { PipelineController } from "../infrastructure/http/controllers/PipelineController.js";
import { GetPlanning } from "../application/usecases/planning/GetPlanning.js";
import { UpdatePlanning } from "../application/usecases/planning/UpdatePlanning.js";
import { PlanningController } from "../infrastructure/http/controllers/PlanningController.js";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository.js";
import { GetUsers } from "../application/usecases/users/GetUsers.js";
import { CreateUser } from "../application/usecases/users/CreateUser.js";
import { UserController } from "../infrastructure/http/controllers/UserController.js";
import { LoginUser } from "../application/usecases/auth/LoginUser.js";
import { GetCurrentUser } from "../application/usecases/auth/GetCurrentUser.js";
import { AuthController } from "../infrastructure/http/controllers/AuthController.js";
import { WhisperAudioTranscriber } from "../infrastructure/adapters/WhisperAudioTranscriber.js";
import { TranscribeAudio } from "../application/usecases/audio/TranscribeAudio.js";
import { AudioController } from "../infrastructure/http/controllers/AudioController.js";
import { BpasCardPrefillAI } from "../infrastructure/adapters/BpasCardPrefillAI.js";
import { PrefillCard } from "../application/usecases/ai/PrefillCard.js";
import { AiCardController } from "../infrastructure/http/controllers/AiCardController.js";
import { BpasClarifier } from "../infrastructure/adapters/BpasClarifier.js";
import { ClarifyText } from "../application/usecases/clarify/ClarifyText.js";
import { ClarifyController } from "../infrastructure/http/controllers/ClarifyController.js";
import { ProcessSyncQueue } from "../application/usecases/sync/ProcessSyncQueue.js";
import { SyncController } from "../infrastructure/http/controllers/SyncController.js";
import { PrismaActivityRepository } from "../infrastructure/repositories/PrismaActivityRepository.js";
import { GetRecentActivities } from "../application/usecases/activities/GetRecentActivities.js";
import { ActivityController } from "../infrastructure/http/controllers/ActivityController.js";

const clientRepository = new PrismaClientRepository(prisma);
const cardRepository = new PrismaCardRepository(prisma);
const projectRepository = new PrismaProjectRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const audioTranscriber = new WhisperAudioTranscriber();
const cardPrefillAI = new BpasCardPrefillAI();
const clarifier = new BpasClarifier();
const activityRepository = new PrismaActivityRepository(prisma);

const createClient = new CreateClient(clientRepository);
const getClients = new GetClients(clientRepository);
const getClientById = new GetClientById(clientRepository);
const getClientCards = new GetClientCards(cardRepository);
const updateClient = new UpdateClient(clientRepository);
const deleteClient = new DeleteClient(clientRepository);

const clientController = new ClientController({
  createClient,
  getClients,
  getClientById,
  getClientCards,
  updateClient,
  deleteClient
});

const createCard = new CreateCard(cardRepository);
const getCards = new GetCards(cardRepository);
const getCardById = new GetCardById(cardRepository);
const updateCard = new UpdateCard(cardRepository);
const updateCardActivity = new UpdateCardActivity(cardRepository);

const cardController = new CardController({
  createCard,
  getCards,
  getCardById,
  updateCard,
  updateCardActivity
});

const createProject = new CreateProject(projectRepository);
const getProjects = new GetProjects(projectRepository);
const getProjectById = new GetProjectById(projectRepository);
const getProjectCards = new GetProjectCards(cardRepository);
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);

const projectController = new ProjectController({
  createProject,
  getProjects,
  getProjectById,
  getProjectCards,
  updateProject,
  deleteProject
});

const getPipeline = new GetPipeline(cardRepository);
const pipelineController = new PipelineController({ getPipeline });

const getPlanning = new GetPlanning(cardRepository);
const updatePlanning = new UpdatePlanning(cardRepository);
const planningController = new PlanningController({ getPlanning, updatePlanning });

const getUsers = new GetUsers(userRepository);
const createUser = new CreateUser(userRepository);
const userController = new UserController({ getUsers, createUser });

const loginUser = new LoginUser(userRepository);
const getCurrentUser = new GetCurrentUser();
const authController = new AuthController({ loginUser, getCurrentUser });

const transcribeAudio = new TranscribeAudio(audioTranscriber);
const audioController = new AudioController({ transcribeAudio });

const prefillCard = new PrefillCard({
  cardPrefillAI,
  clientRepository,
  projectRepository,
  userRepository
});
const aiCardController = new AiCardController({ prefillCard });

const clarifyText = new ClarifyText(clarifier);
const clarifyController = new ClarifyController({ clarifyText });

const processSyncQueue = new ProcessSyncQueue({ createCard, updateCard, updateCardActivity });
const syncController = new SyncController({ processSyncQueue });

const getRecentActivities = new GetRecentActivities(activityRepository);
const activityController = new ActivityController({ getRecentActivities });

export const container = {
  clientController,
  cardController,
  projectController,
  pipelineController,
  planningController,
  userController,
  authController,
  audioController,
  aiCardController,
  clarifyController,
  syncController,
  activityController
};
