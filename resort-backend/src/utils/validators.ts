import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email deve ter um formato válido',
            'any.required': 'Email é obrigatório'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Senha deve ter pelo menos 6 caracteres',
            'any.required': 'Senha é obrigatória'
        })
});

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email deve ter um formato válido',
            'any.required': 'Email é obrigatório'
        }),
    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
            'string.min': 'Senha deve ter pelo menos 6 caracteres',
            'string.pattern.base': 'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
            'any.required': 'Senha é obrigatória'
        }),
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Nome deve ter pelo menos 2 caracteres',
            'string.max': 'Nome deve ter no máximo 255 caracteres',
            'any.required': 'Nome é obrigatório'
        }),
    role: Joi.string()
        .valid('admin', 'employee')
        .required()
        .messages({
            'any.only': 'Role deve ser "admin" ou "employee"',
            'any.required': 'Role é obrigatória'
        }),
    phone: Joi.string()
        .pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Telefone deve estar no formato (XX) XXXXX-XXXX'
        })  
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token é obrigatório'
        })
});

// Validadores para Minibar
export const createMinibarItemSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Nome deve ter pelo menos 2 caracteres',
            'string.max': 'Nome deve ter no máximo 255 caracteres',
            'any.required': 'Nome é obrigatório'
        }),
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Preço deve ser um número',
            'number.positive': 'Preço deve ser positivo',
            'number.precision': 'Preço deve ter no máximo 2 casas decimais',
            'any.required': 'Preço é obrigatório'
        }),
    category: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Categoria deve ter pelo menos 2 caracteres',
            'string.max': 'Categoria deve ter no máximo 100 caracteres',
            'any.required': 'Categoria é obrigatória'
        })
});

export const updateMinibarItemSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Nome deve ter pelo menos 2 caracteres',
            'string.max': 'Nome deve ter no máximo 255 caracteres'
        }),
    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Preço deve ser um número',
            'number.positive': 'Preço deve ser positivo',
            'number.precision': 'Preço deve ter no máximo 2 casas decimais'
        }),
    category: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Categoria deve ter pelo menos 2 caracteres',
            'string.max': 'Categoria deve ter no máximo 100 caracteres'
        }),
    is_active: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'is_active deve ser um valor booleano'
        })
});

export const createMinibarConsumptionSchema = Joi.object({
    reservation_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID da reserva deve ser um número',
            'number.integer': 'ID da reserva deve ser um número inteiro',
            'number.positive': 'ID da reserva deve ser positivo',
            'any.required': 'ID da reserva é obrigatório'
        }),
    minibar_item_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID do item deve ser um número',
            'number.integer': 'ID do item deve ser um número inteiro',
            'number.positive': 'ID do item deve ser positivo',
            'any.required': 'ID do item é obrigatório'
        }),
    quantity: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Quantidade deve ser um número',
            'number.integer': 'Quantidade deve ser um número inteiro',
            'number.positive': 'Quantidade deve ser positiva',
            'any.required': 'Quantidade é obrigatória'
        })
});

// Validadores para Pagamentos
export const createPaymentSchema = Joi.object({
    reservation_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID da reserva deve ser um número',
            'number.integer': 'ID da reserva deve ser um número inteiro',
            'number.positive': 'ID da reserva deve ser positivo',
            'any.required': 'ID da reserva é obrigatório'
        }),
    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Valor deve ser um número',
            'number.positive': 'Valor deve ser positivo',
            'number.precision': 'Valor deve ter no máximo 2 casas decimais',
            'any.required': 'Valor é obrigatório'
        }),
    payment_method: Joi.string()
        .valid('credit_card', 'debit_card', 'pix', 'cash', 'bank_transfer', 'check')
        .required()
        .messages({
            'any.only': 'Método de pagamento deve ser: credit_card, debit_card, pix, cash, bank_transfer, check',
            'any.required': 'Método de pagamento é obrigatório'
        }),
    transaction_id: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'ID da transação deve ter no máximo 255 caracteres'
        })
});

export const updatePaymentSchema = Joi.object({
    amount: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Valor deve ser um número',
            'number.positive': 'Valor deve ser positivo',
            'number.precision': 'Valor deve ter no máximo 2 casas decimais'
        }),
    payment_method: Joi.string()
        .valid('credit_card', 'debit_card', 'pix', 'cash', 'bank_transfer', 'check')
        .optional()
        .messages({
            'any.only': 'Método de pagamento deve ser: credit_card, debit_card, pix, cash, bank_transfer, check'
        }),
    transaction_id: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'ID da transação deve ter no máximo 255 caracteres'
        }),
    status: Joi.string()
        .valid('pending', 'paid', 'partially_paid', 'refunded')
        .optional()
        .messages({
            'any.only': 'Status deve ser: pending, paid, partially_paid, refunded'
        })
});

export const processPaymentSchema = Joi.object({
    payment_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID do pagamento deve ser um número',
            'number.integer': 'ID do pagamento deve ser um número inteiro',
            'number.positive': 'ID do pagamento deve ser positivo',
            'any.required': 'ID do pagamento é obrigatório'
        }),
    transaction_id: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'ID da transação deve ter no máximo 255 caracteres'
        })
});

// Validadores para Notificações
export const createNotificationSchema = Joi.object({
    reservation_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID da reserva deve ser um número',
            'number.integer': 'ID da reserva deve ser um número inteiro',
            'number.positive': 'ID da reserva deve ser positivo',
            'any.required': 'ID da reserva é obrigatório'
        }),
    type: Joi.string()
        .valid('checkout_1h', 'checkout_30min', 'checkin_reminder', 'payment_reminder', 'minibar_consumption', 'system_alert')
        .required()
        .messages({
            'any.only': 'Tipo deve ser: checkout_1h, checkout_30min, checkin_reminder, payment_reminder, minibar_consumption, system_alert',
            'any.required': 'Tipo é obrigatório'
        }),
    message: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Mensagem deve ter pelo menos 10 caracteres',
            'string.max': 'Mensagem deve ter no máximo 1000 caracteres',
            'any.required': 'Mensagem é obrigatória'
        })
});

export const updateNotificationSchema = Joi.object({
    sent_at: Joi.date()
        .optional()
        .messages({
            'date.base': 'Data de envio deve ser uma data válida'
        }),
    status: Joi.string()
        .valid('pending', 'sent', 'failed')
        .optional()
        .messages({
            'any.only': 'Status deve ser: pending, sent, failed'
        })
});

export const sendNotificationSchema = Joi.object({
    notification_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID da notificação deve ser um número',
            'number.integer': 'ID da notificação deve ser um número inteiro',
            'number.positive': 'ID da notificação deve ser positivo',
            'any.required': 'ID da notificação é obrigatório'
        })
});

// Validadores para Upload de Arquivos
export const uploadFileSchema = Joi.object({
    category: Joi.string()
        .valid('room_image', 'guest_document', 'payment_receipt', 'system_file')
        .required()
        .messages({
            'any.only': 'Categoria deve ser: room_image, guest_document, payment_receipt, system_file',
            'any.required': 'Categoria é obrigatória'
        }),
    entity_type: Joi.string()
        .valid('room', 'guest', 'payment', 'system')
        .required()
        .messages({
            'any.only': 'Tipo de entidade deve ser: room, guest, payment, system',
            'any.required': 'Tipo de entidade é obrigatório'
        }),
    entity_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'ID da entidade deve ser um número',
            'number.integer': 'ID da entidade deve ser um número inteiro',
            'number.positive': 'ID da entidade deve ser positivo'
        })
});

export const updateFileUploadSchema = Joi.object({
    is_active: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'is_active deve ser um valor booleano'
        }),
    entity_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'ID da entidade deve ser um número',
            'number.integer': 'ID da entidade deve ser um número inteiro',
            'number.positive': 'ID da entidade deve ser positivo'
        })
});

export const getFilesByEntitySchema = Joi.object({
    entity_type: Joi.string()
        .valid('room', 'guest', 'payment', 'system')
        .required()
        .messages({
            'any.only': 'Tipo de entidade deve ser: room, guest, payment, system',
            'any.required': 'Tipo de entidade é obrigatório'
        }),
    entity_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID da entidade deve ser um número',
            'number.integer': 'ID da entidade deve ser um número inteiro',
            'number.positive': 'ID da entidade deve ser positivo',
            'any.required': 'ID da entidade é obrigatório'
        })
});

// Validadores para Relatórios
export const generateReportSchema = Joi.object({
    report_type: Joi.string()
        .valid('financial', 'occupancy', 'minibar', 'notifications', 'custom')
        .required()
        .messages({
            'any.only': 'Tipo de relatório deve ser: financial, occupancy, minibar, notifications, custom',
            'any.required': 'Tipo de relatório é obrigatório'
        }),
    format: Joi.string()
        .valid('pdf', 'excel', 'csv', 'json')
        .required()
        .messages({
            'any.only': 'Formato deve ser: pdf, excel, csv, json',
            'any.required': 'Formato é obrigatório'
        }),
    start_date: Joi.date()
        .optional()
        .messages({
            'date.base': 'Data inicial deve ser uma data válida'
        }),
    end_date: Joi.date()
        .optional()
        .messages({
            'date.base': 'Data final deve ser uma data válida'
        }),
    filters: Joi.object()
        .optional()
        .messages({
            'object.base': 'Filtros devem ser um objeto válido'
        }),
    group_by: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
            'array.base': 'Agrupamento deve ser um array de strings'
        }),
    sort_by: Joi.string()
        .optional()
        .messages({
            'string.base': 'Campo de ordenação deve ser uma string'
        }),
    sort_order: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .messages({
            'any.only': 'Ordem de classificação deve ser: asc, desc'
        }),
    limit: Joi.number()
        .integer()
        .positive()
        .max(1000)
        .optional()
        .messages({
            'number.base': 'Limite deve ser um número',
            'number.integer': 'Limite deve ser um número inteiro',
            'number.positive': 'Limite deve ser positivo',
            'number.max': 'Limite máximo é 1000'
        })
});

export const customReportSchema = Joi.object({
    report_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Nome do relatório deve ter pelo menos 3 caracteres',
            'string.max': 'Nome do relatório deve ter no máximo 100 caracteres',
            'any.required': 'Nome do relatório é obrigatório'
        }),
    query: Joi.string()
        .min(10)
        .max(5000)
        .required()
        .messages({
            'string.min': 'Query deve ter pelo menos 10 caracteres',
            'string.max': 'Query deve ter no máximo 5000 caracteres',
            'any.required': 'Query é obrigatória'
        }),
    parameters: Joi.object()
        .optional()
        .messages({
            'object.base': 'Parâmetros devem ser um objeto válido'
        })
});

export const reportScheduleSchema = Joi.object({
    report_type: Joi.string()
        .valid('financial', 'occupancy', 'minibar', 'notifications', 'custom')
        .required()
        .messages({
            'any.only': 'Tipo de relatório deve ser: financial, occupancy, minibar, notifications, custom',
            'any.required': 'Tipo de relatório é obrigatório'
        }),
    format: Joi.string()
        .valid('pdf', 'excel', 'csv', 'json')
        .required()
        .messages({
            'any.only': 'Formato deve ser: pdf, excel, csv, json',
            'any.required': 'Formato é obrigatório'
        }),
    schedule_type: Joi.string()
        .valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly')
        .required()
        .messages({
            'any.only': 'Tipo de agendamento deve ser: daily, weekly, monthly, quarterly, yearly',
            'any.required': 'Tipo de agendamento é obrigatório'
        }),
    schedule_config: Joi.object()
        .optional()
        .messages({
            'object.base': 'Configuração de agendamento deve ser um objeto válido'
        }),
    email_recipients: Joi.array()
        .items(Joi.string().email())
        .optional()
        .messages({
            'array.base': 'Destinatários devem ser um array de emails válidos'
        }),
    is_active: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'is_active deve ser um valor booleano'
        })
});