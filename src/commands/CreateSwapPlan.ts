import * as core from '@actions/core';
import { DefaultArtifactClient, Artifact, DownloadArtifactResponse } from '@actions/artifact';
import fs from 'fs';
import path from 'path';
import { createBranchWhenNotExist, createPullRequest, gitCommit, gitCommitNewBranch } from '../utils/githubUtiltiy';
import { constants } from '../constants';
import { executeProcess } from '../utils/executeProcess';
import { PathUtility } from '../utils/PathUtility';
const { WorkingDirectory, DefaultEncoding, gitConfig } = constants;

interface ICreateSwapPlanOption {
  repo: string;
  ref: string;
  token: string;
  path: string;
}

interface ArtifactItem extends DownloadArtifactResponse, Artifact {
  downloadPath: string;
}

export class CreateSwapPlan {
  constructor(private options: ICreateSwapPlanOption) {}

  public async execute() {
    core.debug(`Using create-swap-plan mode`);
    const { repo, path: targetPath, ref, token: personalAccessToken } = this.options;
    const artifactClient = new DefaultArtifactClient();
    const listArtifactsResponse = await artifactClient.listArtifacts();

    const sharedGitConfig = {
      repo,
      ref,
      personalAccessToken,
      name: gitConfig.name,
      email: gitConfig.email,
    };

    await createBranchWhenNotExist(sharedGitConfig);

    /**
     * Step 2: Commit Marked App Setting (Source Slot)
     */
    const pathUtility = new PathUtility(WorkingDirectory.root);
    fs.mkdirSync(WorkingDirectory.root, { recursive: true });

    await executeProcess('tree', { slient: false });

    const artifactItems: ArtifactItem[] = [];

    // output result
    for (const artifact of listArtifactsResponse.artifacts) {
      const downloadArtifactResponse = await artifactClient.downloadArtifact(artifact.id, {
        path: artifact.name,
      });
      if (!downloadArtifactResponse.downloadPath) {
        core.warning(`Artifact ${artifact.name} did not have a download path.`);
        continue;
      }
      artifactItems.push({ ...downloadArtifactResponse, ...artifact } as ArtifactItem);
      console.log(artifact.name);
      console.log(downloadArtifactResponse.downloadPath);
      const beforePath = path.join(
        downloadArtifactResponse.downloadPath,
        WorkingDirectory.root,
        WorkingDirectory.beforeSwap
      );
      await executeProcess(`cp -rf ${beforePath}/* ${WorkingDirectory.root}/`);
    }

    await gitCommit({
      ...sharedGitConfig,
      targetPath,
      rootPath: WorkingDirectory.root,
      message: 'Get App Setting',
    });
    pathUtility.clean();
    fs.mkdirSync(WorkingDirectory.root, { recursive: true });

    /**
     * Step 3: Simulate if values are swapped (Target Slot)
     */
    for (const artifact of artifactItems) {
      console.log(artifact.name);
      console.log(artifact.downloadPath);
      const afterPath = path.join(artifact.downloadPath, WorkingDirectory.root, WorkingDirectory.afterSwap);
      await executeProcess(`cp -rf ${afterPath}/* ${WorkingDirectory.root}/`);
    }

    // Create tmp file if no change it will be merge
    fs.writeFileSync(
      path.resolve(WorkingDirectory.root, `timestamp-${new Date().getTime()}`),
      'Force Diff for Preview Change',
      DefaultEncoding
    );

    const newBranch = await gitCommitNewBranch({
      ...sharedGitConfig,
      targetPath,
      rootPath: WorkingDirectory.root,
      message: 'Get App Setting if app service is swapped',
    });

    await createPullRequest({
      ...sharedGitConfig,
      sourceBranch: newBranch,
    });
  }
}
