variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "task-management-rg"
}

variable "location" {
  description = "Azure region to deploy resources into"
  type        = string
  default     = "East US"
}

variable "app_service_plan_name" {
  description = "Name of the shared App Service Plan"
  type        = string
  default     = "task-management-plan"
}

variable "ui_app_name" {
  description = "Globally unique name for the UI App Service"
  type        = string
  default     = "task-management-ui-app"
}

variable "api_app_name" {
  description = "Globally unique name for the API App Service"
  type        = string
  default     = "task-management-api-app"
}

variable "sku_name" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}
