
export const userFactory = (override = {}) => ({
  name: 'Recrutador Teste',
  email: `user_${Date.now()}_${Math.random().toString(36).slice(2)}@empresa.com`,
  password: 'Senha@123',
  role: 'RECRUITER',
  ...override,
});

export const departmentFactory = (override = {}) => ({
  name: `Departamento_${Date.now()}`,
  ...override,
});

export const candidateFactory = (override = {}) => ({
  fullName: 'Candidato Teste',
  email: `candidato_${Date.now()}@email.com`,
  phone: '11999999999',
  ...override,
});

export const jobPositionFactory = (departmentId: string, override = {}) => ({
  title: 'Desenvolvedor Backend',
  description: 'Vaga para dev backend',
  departmentId,
  ...override,
});

export const jobApplicationFactory = (candidateId: string, positionId: string) => ({
  candidateId,
  positionId,
});

export const internalNoteFactory = (applicationId: string, authorId: string, override = {}) => ({
  content: 'Candidato com bom perfil técnico',
  rating: 4,
  applicationId,
  authorId,
  ...override,
});