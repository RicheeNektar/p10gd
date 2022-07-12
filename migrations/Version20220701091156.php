<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220701091156 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE backups (
                `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                `key` VARCHAR(256) NOT NULL UNIQUE
            )
        ');
        $this->addSql('
            CREATE TABLE backup_chunks (
                `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                `backup_id` INT NOT NULL,
                `chunk_number` INT NOT NULL,
                `data` VARCHAR(4140) NOT NULL,
                CONSTRAINT `fk_backup_chunks_backup_id` FOREIGN KEY (`backup_id`) REFERENCES `backups` (`id`)
            )
        ');
        $this->addSql('
            CREATE INDEX `idx_backup_id` ON `backup_chunks` ( `backup_id` )
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE `backup_chunks`');
        $this->addSql('DROP TABLE `backups`');
    }
}
