import {
	ApplicationCommandDataResolvable,
	CommandInteraction,
	CacheType,
	MessageEmbed,
	GuildMember,
} from 'discord.js';
import { player } from '..';
import { Bot } from '../Bot';
import { SlashCommand } from './SlashCommand';

export class ClearQueue implements SlashCommand {
	name: string = 'clearqueue';
	description = 'Clear the music queue.';
	options = [];
	requiredPermissions: bigint[] = [];
	run(bot: Bot, interaction: CommandInteraction<CacheType>): Promise<void> {
		try {
			const embed = new MessageEmbed().setColor('BLUE');

			let member = interaction.member as GuildMember;
			let state = member.voice.channel;

			//if user is not connected
			if (!state) {
				embed.setDescription('You are not connected to a voice channel!');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			//if mirror is not connected to voice
			if (!interaction.guild!.me?.voice.channel) {
				embed.setDescription(
					'Mirror is not connected to a voice channel, use `/join`'
				);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			//if the user is not connected to the correct voice, end
			else if (interaction.guild!.me?.voice.channel!.id != state.id) {
				embed.setDescription(
					'Mirror is not in your voice channel! To use voice commands join the channel mirror is sitting in, or use `join` to move it to your call'
				);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			let queue = player.getQueue(interaction.guild!.id);
			if (!queue || !queue.playing) {
				embed.setDescription(
					'There are no songs in the queue or the player is not playing'
				);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			queue.clear();
			embed.setDescription(`Queue has been cleared by ${interaction.user}`);
			return interaction.reply({ embeds: [embed] });
		} catch (err) {
			bot.logger.commandError(interaction.channel!.id, this.name, err);
			return interaction.reply({
				content: 'Error: contact a developer to investigate',
				ephemeral: true,
			});
		}
	}
	guildRequired?: boolean | undefined = true;
	managerRequired?: boolean | undefined;
	blockSilenced?: boolean | undefined = true;
}
