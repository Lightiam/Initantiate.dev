import { HttpError } from 'wasp/server'

export const getUserInfrastructures = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  return context.entities.Infrastructure.findMany({
    where: { userId: context.user.id }
  });
}

export const getInfrastructureDetails = async ({ id }, context) => {
  if (!context.user) { throw new HttpError(401); }
  const infrastructure = await context.entities.Infrastructure.findUnique({
    where: { id, userId: context.user.id },
    select: {
      id: true,
      description: true,
      code: true,
      status: true
    }
  });
  if (!infrastructure) throw new HttpError(404, 'No infrastructure found with the provided id for this user.');
  return infrastructure;
}
