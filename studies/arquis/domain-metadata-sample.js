/* 
Example of a Domain definition with multiple Aggregates
*/

export const MODEL_DEFINITION = {
   domain: {
      name: "Onboarding",
      description: "Onboarding of financial and comercial loans",
   },
   aggregates: {
      Simulation: {
         description: "Simulation of a financial loan or vehicle leasing",

         valueObjects: {
            Contact: {
               description: "Some contact information",
               fields: {
                  type: { type: "String", notnull: true },
                  Value: { type: "String", notnull: true },
               },
            },
            Prospect: {
               description: "Potencial customer, only name and contact",
               fields: {
                  name: { type: "String", notnull: true },
                  contact: "Contact",
               },
            },
            CalculationInput: {
               description: "Input data for a loan calculation",
               fields: {
                  assetPrice: { type: "Double", notnull: true, min: 1 },
                  initialEntry: "Double",
                  insurancePremium: "Double",
                  indexerValue: "Double",
                  term: "Integer",
               },
            },
            CalculationOutput: {
               description: "Data resulted from a loan calculation",
               fields: {
                  term: "Integer",
                  installment: "Double",
                  mtic: "Double",
                  taeg: "Double",
               },
            },
         },

         entities: {
            Simulation: {
               root: true,
               fields: {
                  id: { type: "Integer", pk: true, auto: true },
                  product: { type: "String", notnull: true },
                  pointOfSale: { type: "String", notnull: true },
                  financingTerms: { type: "CalculationInput", notnull: true },
                  paymentTerms: "CalculationOutput",
               },
            },
            SimulationShare: {
               description: "Simulations shared with Prospects",
               fields: {
                  id: { type: "Integer", pk: true, auto: true },
                  simulationId: { type: "Simulation", notnull: true },
                  prospect: { type: "Prospect", notnull: true },
                  shareDate: { type: "Datetime", notnull: true },
               },
            },
         },
      },
      Proposal: {
         description: "Handles data required to build a financing Contract",
         valueObjects: {
            Contact: {
               description: "Some contact information",
               fields: {
                  type: { type: "String", notnull: true },
                  Value: { type: "String", notnull: true },
                  primary: "Boolean",
               },
            },
            Address: {
               description: "A home or office postal adress",
               fields: {
                  streetName: "String",
                  doorDouble: "Integer",
                  postalCode: "String",
               },
            },
            Participant: {
               description: "A persona that participates in the loan",
               fields: {
                  personaId: { type: "Persona", notnull: true },
                  role: { type: "String", enum: ["Primary", "Secondary", "Garantor", "Family", "Partner"], notnull: true },
               },
            },
            Relation: {
               description: "A relation between two personas",
               fields: {
                  leftId: { type: "Persona", notnull: true },
                  rightId: { type: "Persona", notnull: true },
                  type: { type: "String", enum: ["Spouse", "Parent", "Partner"], notnull: true },
                  notes: "String",
               },
            },
         },
         entities: {
            Dealer: {
               id: { type: "Integer", pk: true, auto: true },
               name: { type: "String", notnull: true },
               adress: { type: "Address", notnull: true },
            },
            PointOfSales: {
               id: { type: "Integer", pk: true, auto: true },
               name: { type: "String", notnull: true },
               adress: { type: "Address", notnull: true },
               dealerId: { type: "Dealer", notnull: true },
            },
            Persona: {
               fields: {
                  id: { type: "Integer", pk: true, auto: true },
                  type: { type: "String", enum: ["Individual", "Company"], notnull: true },
                  fiscalNumber: { type: "String", notnull: true },
                  name: { type: "String", notnull: true },
                  birthDate: { type: "Date", notnull: true },
                  homeAddress: { type: "Address", notnull: true },
                  fiscalAddress: "Address",
                  contacts: "Contact[]",
               },
            },
            Proposal: {
               fields: {
                  id: { type: "Integer", pk: true, auto: true },
                  number: "String",
                  dealerId: { type: "Dealer", notnull: true },
                  pointOfSaleId: { type: "Integer", notnull: true },
                  salesChannel: ["PointOfSales", "SelfService"],
                  simulationId: { type: "Simulation", notnull: true },
                  participants: "Participant[]",
                  relations: "Relation[]",
                  status: ["DataEntry", "Decision", "Completed"],
                  decision: ["Approved", "Rejected", "Withdrawn", "Cancelled", "Nulled"],
               },
            },
         },
      },
   },
};

export const OPERATION_DEFINITION = {
   Simulation: ["createSimulation", "updateSimulation", "calculateLoan", "shareSimulation", "cloneSimulation"],
   Proposal: ["createProposal", "updateCustomer", "changeCustomerAddress", "sendProposal", "approveProposal", "refuseProposal", "getProposal"],
};

export const VALIDATION_RULES = {
   Simulation: [
      "Simulation can only be shared after loan has been calculated",
      "Simulation cannot allow changes in financingTerms if it has been shared",
      "Simulation cannot be calculated if it has been shared",
   ],
   Proposal: [
      "Customer name mandatory",
      "Customer birth date mandatory",
      "Address street mandatory",
      "Door Double greater than zero",
      "Proposal starts in CREATED state",
      "Only CREATED proposal can be SENT",
      "Only SENT proposal can be APPROVED",
      "Only SENT proposal can be REFUSED",
   ],
};
