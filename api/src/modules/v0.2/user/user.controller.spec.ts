import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { RoleName, Sex } from "../../../../shared/enums/user.enum";
import { of } from "rxjs";
import { UpdateResult } from "typeorm";

describe("UserController", () => {
  let controller: UserController;
  let userService: {
    findByNickname: jest.Mock;
    findById: jest.Mock;
    updateUserProfile: jest.Mock;
    create: jest.Mock;
  };
  let elasticsearchService: {
    indices: { create: jest.Mock };
    index: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      findByNickname: jest.fn(),
      findById: jest.fn(),
      updateUserProfile: jest.fn(),
      create: jest.fn(),
    };

    elasticsearchService = {
      indices: {
        create: jest.fn(),
      },
      index: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: ElasticsearchService, useValue: elasticsearchService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe("handleSearchByNickname", () => {
    it("should return array of users", (done) => {
      const nickname = "john";
      const users = [
        { uuid: "1", nickname: "john" },
        { uuid: "2", nickname: "johnny" },
      ];
      userService.findByNickname.mockReturnValue(of(users));

      controller.handleSearchByNickname(nickname).subscribe((result) => {
        expect(userService.findByNickname).toHaveBeenCalledWith(nickname);
        expect(result).toEqual(users);
        done();
      });
    });
  });

  describe("handleMe", () => {
    it("should return the current user from request", async () => {
      const fakeUser = { uuid: "user-1", nickname: "tester" };
      const req = { user: fakeUser } as any;

      const result = await controller.handleMe(req);
      expect(result).toEqual(fakeUser);
    });
  });

  describe("handleMeEdit", () => {
    it("should update current user profile and return UpdateResult", (done) => {
      const fakeUser = { uuid: "user-uuid" };
      const req = { user: Promise.resolve(fakeUser) } as any;
      const userData = { nickname: "newnick" };
      const updateResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      userService.updateUserProfile.mockReturnValue(of(updateResult));

      controller.handleMeEdit(req, userData).subscribe((result) => {
        expect(userService.updateUserProfile).toHaveBeenCalledWith(
          fakeUser.uuid,
          userData
        );
        expect(result).toEqual(updateResult);
        done();
      });
    });

    it("should throw error if user not found", (done) => {
      const req = { user: Promise.resolve(null) } as any;
      const userData = { nickname: "newnick" };

      controller.handleMeEdit(req, userData).subscribe({
        error: (err) => {
          expect(err.message).toBe("User not found");
          done();
        },
      });
    });
  });

  describe("handleFindOne", () => {
    it("should return user by id", (done) => {
      const userId = "123";
      const user = { uuid: userId, nickname: "tester" };
      userService.findById.mockReturnValue(of(user));

      controller.handleFindOne(userId).subscribe((result) => {
        expect(userService.findById).toHaveBeenCalledWith(userId);
        expect(result).toEqual(user);
        done();
      });
    });
  });

  describe("generateMockUsers", () => {
    it("should create mock users and index them", async () => {
      const mockUsersCount = 5;
      // Мок результата create
      userService.create.mockImplementation((userDto) =>
        of({ ...userDto, uuid: `uuid-${Math.random()}` })
      );

      elasticsearchService.indices.create.mockResolvedValue({});
      elasticsearchService.index.mockResolvedValue({});

      const result = await controller.generateMockUsers(mockUsersCount);

      expect(elasticsearchService.indices.create).toHaveBeenCalledWith(
        expect.objectContaining({ index: "users" }),
        { ignore: [400] }
      );
      expect(userService.create).toHaveBeenCalledTimes(mockUsersCount);
      expect(elasticsearchService.index).toHaveBeenCalledTimes(mockUsersCount);
      expect(result).toEqual({ count: mockUsersCount });
    });
  });
});
