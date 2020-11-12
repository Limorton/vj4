import logging
import asyncio

from vj4 import db
from vj4 import constant
from vj4.model import builtin
from vj4.model import domain
from vj4.model import user
from vj4.util import argmethod
from vj4.util import domainjob
from vj4.handler import base
from vj4.model.adaptor import problem
from vj4.model.adaptor import training


_logger = logging.getLogger(__name__)


class TrainingMixin(object):
  def get_pids(self, tdoc):
    pids = set()
    for node in tdoc['dag']:
      pids.update(node['pids'])
    return list(pids)

  def is_done(self, node, done_nids, done_pids):
    return set(done_nids) >= set(node['require_nids']) \
           and set(done_pids) >= set(node['pids'])

  def is_progress(self, node, done_nids, done_pids, prog_pids):
    return set(done_nids) >= set(node['require_nids']) \
           and not set(done_pids) >= set(node['pids']) \
           and ((set(done_pids) | set(prog_pids)) & set(node['pids']))

  def is_open(self, node, done_nids, done_pids, prog_pids):
    return set(done_nids) >= set(node['require_nids']) \
           and not set(done_pids) >= set(node['pids']) \
           and not ((set(done_pids) | set(prog_pids)) & set(node['pids']))

  def is_invalid(self, node, done_nids):
    return not set(done_nids) >= set(node['require_nids'])

training_ = TrainingMixin()

@domainjob.wrap
async def run(domain_id: str):
  # calculate training rank
  _logger.info('Training Ranking')
  tdocs = training.get_multi(domain_id)
  count = 0
  async for tdoc in tdocs:
    count += 1
    _logger.info('Update training {0}'.format(tdoc['title']))
    # get pids
    pids = training_.get_pids(tdoc)
    # get attend users
    dudocs = await training.get_multi_status(domain_id=domain_id, doc_id=tdoc['doc_id'], enroll=1).to_list()
    dudict = await user.get_dict(set(dudoc['uid'] for dudoc in dudocs))
    pdict = await problem.get_dict(domain_id, pids)
    for dudoc in dudocs:
      psdict = await problem.get_dict_status(domain_id, dudoc['uid'], pdict.keys())
      done_pids = set()
      prog_pids = set()
      for pid, psdoc in psdict.items():
        if 'status' in psdoc:
          if psdoc['status'] == constant.record.STATUS_ACCEPTED:
            done_pids.add(pid)
          else:
            prog_pids.add(pid)
      nsdict = {}
      ndict = {}
      done_nids = set()
      for node in tdoc['dag']:
        ndict[node['_id']] = node
        total_count = len(node['pids'])
        done_count = len(set(node['pids']) & set(done_pids))
        nsdoc = {'progress': int(100 * done_count / total_count) if total_count else 100,
                'is_done': training_.is_done(node, done_nids, done_pids),
                'is_progress': training_.is_progress(node, done_nids, done_pids, prog_pids),
                'is_open': training_.is_open(node, done_nids, done_pids, prog_pids),
                'is_invalid': training_.is_invalid(node, done_nids)}
        if nsdoc['is_done']:
          done_nids.add(node['_id'])
        nsdict[node['_id']] = nsdoc
      _logger.info(f"{dudoc['uid']} has done {len(done_pids)} problems")
      tsdoc = await training.set_status(domain_id, tdoc['doc_id'], dudoc['uid'],
                                        done_nids=list(done_nids), done_pids=list(done_pids), num_done = len(done_pids),
                                        done=len(done_nids) == len(tdoc['dag']))
  if count is 0:
    _logger.info(f'No training in domain {domain_id}')

if __name__ == '__main__':
  argmethod.invoke_by_args()
