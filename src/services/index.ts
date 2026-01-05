// Central export file for all services
export { default as api } from './api';
export { default as authService } from './auth.service';
export { default as userService } from './users.service';
export { default as roleService } from './roles.service';
export { default as listService } from './lists.service';
export { default as fileService } from './files.service';
export { default as campaignService } from './campaigns.service';
export { default as candidateService } from './candidates.service';
export { default as organizationService } from './organizations.service';
export { default as schoolService } from './schools.service';

// Named exports for convenience
export {
    api,
    authService,
    userService,
    roleService,
    listService,
    fileService,
    campaignService,
    candidateService,
    organizationService,
    schoolService
};
