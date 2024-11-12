import { healthService } from '~~/server/utils/health/service'

export default defineEventHandler(async (event) => {
    return healthService.getHealthInfo()
})