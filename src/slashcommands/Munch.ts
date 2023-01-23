//Referenced from Sicko.ts
//Call it when you're leaving to go eat food 

import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	CacheType,
	GuildMember,
	Permissions,
} from 'discord.js';
import { Bot } from '../Bot';
import { Option, Subcommand } from './Option';
import { SlashCommand } from './SlashCommand';

export class Munch implements SlashCommand {
	name: string = 'sicko';
	description: string = 'Time to go munch some grub. But I will return.';
	options: (Option | Subcommand)[] = [];
	requiredPermissions: bigint[] = [Permissions.FLAGS.SEND_MESSAGES];
	async run(
		bot: Bot,
		interaction: CommandInteraction<CacheType>
	): Promise<void> {
		try {
			let member = interaction.member as GuildMember;
			let state = member.voice;
			if (!state.channel) {
				interaction.reply('you are not in a valid voice channel!');
				return;
			}
			let queue = bot.player.getQueue(interaction.guild!.id);
			if (queue) {
				interaction.reply('Cant go munch while music is playing :sob:');
				return;
			}
			const connection = joinVoiceChannel({
				channelId: state.channelId!,
				guildId: interaction.guildId!,
				adapterCreator: interaction.guild!.voiceAdapterCreator,
			});
			let audio = createAudioPlayer();
			connection.subscribe(audio);
			const mirrormp3 = createAudioResource('./music/minecraft-eating-sound.mp3');
			audio.play(mirrormp3);
			interaction.reply('Someone has gone to munch a lunch.'); //change to unique display name!
			return;
		} catch (err) {
			bot.logger.commandError(interaction.channel!.id, this.name, err);
			interaction.reply({
				content: 'Error: contact a developer to investigate',
				ephemeral: true,
			});
			return;
		}
	}
	guildRequired?: boolean = true;
}
