terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = "ap-south-1"
}

############################################
# VPC
############################################

resource "aws_vpc" "careermatrix_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "careermatrix-vpc"
  }
}

############################################
# INTERNET GATEWAY
############################################

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.careermatrix_vpc.id

  tags = {
    Name = "careermatrix-igw"
  }
}

############################################
# PUBLIC SUBNET
############################################

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.careermatrix_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "careermatrix-public-subnet"
  }
}

############################################
# ROUTE TABLE
############################################

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.careermatrix_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "careermatrix-public-rt"
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

############################################
# SECURITY GROUP
############################################

resource "aws_security_group" "careermatrix_sg" {
  name        = "careermatrix-sg"
  description = "Allow Jenkins Docker SSH"
  vpc_id      = aws_vpc.careermatrix_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


############################################
# EC2 INSTANCE
############################################

resource "aws_instance" "careermatrix_server" {

  ami           = "ami-0e38835daf6b8a2b9"
  instance_type = "t3.micro"

  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.careermatrix_sg.id]

  key_name = "webserver"

  tags = {
    Name = "CareerMatrix-Server"
  }
}

############################################
# OUTPUTS
############################################

output "public_ip" {
  value = aws_instance.careermatrix_server.public_ip
}

output "public_dns" {
  value = aws_instance.careermatrix_server.public_dns
}