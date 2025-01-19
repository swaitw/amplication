import { EnumResourceType } from "@amplication/code-gen-types";
import { Test, TestingModule } from "@nestjs/testing";
import { ResourceService } from "..";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { Resource, User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import { ResourceTemplateVersion } from "./dto";
import { ResourceTemplateVersionService } from "./resourceTemplateVersion.service";

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_NAME = "Example Resource Settings";
const EXAMPLE_RESOURCE_ID = "ExampleResource";

const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "example_workspace_name",
    allowLLMFeatures: true,
  },
  isOwner: true,
};

const EXAMPLE_RESOURCE_SETTINGS: ResourceTemplateVersion = {
  id: "ExampleResourceTemplateVersion",
  updatedAt: new Date(),
  createdAt: new Date(),
  blockType: EnumBlockType.ResourceTemplateVersion,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_NAME,
  parentBlock: null,
  versionNumber: 0,
  serviceTemplateId: "ExampleServiceTemplateId",
  version: "1.0.0",
  resourceId: EXAMPLE_RESOURCE_ID,
};

const createMock = jest.fn(() => {
  return { ...EXAMPLE_RESOURCE_SETTINGS };
});

const findOneMock = jest.fn(() => EXAMPLE_RESOURCE_SETTINGS);
const findManyByBlockTypeMock = jest.fn(() => [EXAMPLE_RESOURCE_SETTINGS]);
const updateMock = jest.fn(() => EXAMPLE_RESOURCE_SETTINGS);

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Example Resource",
  resourceType: EnumResourceType.Service,
  description: "",
  gitRepositoryOverride: false,
  licensed: false,
  blueprintId: "ExampleBlueprint",
};

const prismaResourceFindFirstMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});

const resourceServiceResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});

const prismaMock = {
  resource: {
    findUnique: prismaResourceFindFirstMock,
  },
};

describe("ResourceTemplateVersionService", () => {
  let service: ResourceTemplateVersionService;

  beforeEach(async () => {
    createMock.mockClear();
    findOneMock.mockClear();
    findManyByBlockTypeMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            create: createMock,
            findOne: findOneMock,
            findManyByBlockType: findManyByBlockTypeMock,
            update: updateMock,
          })),
        },
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resource: resourceServiceResourceMock,
          })),
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        ResourceTemplateVersionService,
      ],
      imports: [],
    }).compile();

    service = module.get<ResourceTemplateVersionService>(
      ResourceTemplateVersionService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find one", async () => {
    expect(
      await service.getResourceTemplateVersionBlock({
        where: { id: EXAMPLE_RESOURCE_ID },
      })
    ).toEqual(EXAMPLE_RESOURCE_SETTINGS);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
  });

  it("should update", async () => {
    expect(
      await service.updateResourceTemplateVersion(
        {
          data: {
            ...EXAMPLE_RESOURCE_SETTINGS,
          },
          where: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_RESOURCE_SETTINGS);
    expect(findManyByBlockTypeMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledTimes(1);
  });
});
