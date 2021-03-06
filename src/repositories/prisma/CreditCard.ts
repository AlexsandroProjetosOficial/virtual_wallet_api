import { prisma } from "@database/prisma";
import { ICreateCreditCard } from "types/creditCard/ICreateCreditCard";
import { ICreditCard } from "types/creditCard/ICreditCard";
import { ICreditCardRepository } from "types/creditCard/ICreditCardRepository";
import { IListCreditCard } from "types/creditCard/IListCreditCard";

class CreditCard implements ICreditCardRepository {
	async createCreditCard({
		cardNumber,
		creditCardName,
		expirationDay,
		securityCode,
		limit,
		sinceMember,
		validThru,
		virtualAccountId,
		flagId
	}: ICreateCreditCard): Promise<boolean> {
		const creditCard = await prisma.creditCard.create({
			data: {
				cardNumber,
				creditCardName,
				expirationDay,
				securityCode,
				limit,
				sinceMember,
				validThru,
				virtualAccountId,
				flagId
			}
		});

		return !!creditCard
	};

	async listCreditCard({ cardNumber, virtualAccountId }: IListCreditCard): Promise<ICreditCard> {
		const creditCard = await prisma.creditCard.findFirst({
			where: {
				AND: [
					{
						cardNumber
					},
					{
						virtualAccountId
					},
					{
						status: 1
					}
				]
			}
		});

		return creditCard;
	};

	async listAllCreditCardByVirtualAccountId(virtualAccountId: string): Promise<ICreditCard[]> {
		const creditCards = await prisma.creditCard.findMany({
			where: {
				AND: [
					{
						virtualAccountId
					},
					{
						status: 1
					}
				]
			},
			orderBy: {
				creditCardName: 'asc'
			}
		});

		return creditCards;
	};
};

export { CreditCard }