import datauri from 'datauri';
import Eris, { Client, TextChannel } from 'eris';
import HaSeul from 'haseul';
import { Connection } from 'mysql';
import path from 'path';
import { v4 as uuid4 } from 'uuid';
import pictureFileLocation from '../images/favicon.png';
import AccountTypes from '../AccountTypes';

const deactivateCommand = new HaSeul<Eris.Message>();

deactivateCommand
  .command('myself', ({ message, req, next }) => {
    const sqlConnection: Connection = req.locals.sqlConnection;
    sqlConnection.query(`DELETE FROM accounts WHERE type = ? AND payload = ?`, [AccountTypes.USER_ACCOUNT, message.author.id], (err) => {
      if (err) {
        next(err);
      } else {
        message.channel.createMessage('Deleted all emails for your account.')
      }
    })
  })
  .command('channel', ({ message, req, next }) => {
    if (message.channel instanceof TextChannel) {
      if (req.locals.userHasPermission) {
        const sqlConnection: Connection = req.locals.sqlConnection;
        sqlConnection.query(`DELETE FROM accounts WHERE type = ? AND payload = ?`, [AccountTypes.GUILD_ACCOUNT, message.channel.id], (err) => {
          if (err) {
            next(err);
          } else {
            message.channel.createMessage('Deleted all emails for this channel.')
          }
        })
      } else {
        next(new Error('You don\'t have enough permissions to do this! Ask your administrator for the "manageWebhooks" or "administrator" permission.'))
      }
    } else {
      next(new Error('You cannot delete a text channel account outside a Guild.'))
    }
  })
  .command(({ message }) => {
    message.channel.createMessage({
      content: `
It's okay to leave. Enter a command to deactivate a specific service.

\`discordmail register myself\` - Deactivate DiscordMail for DMs
\`discordmail register channel\` - Deactivate DiscordMail for this channel

To deactivate webhooks, simply delete the webhook from the Discord channel.
`
    })
  })

export default deactivateCommand;
